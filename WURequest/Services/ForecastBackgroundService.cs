using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MongoDB.Bson.Serialization;
using NCrontab;
using WURequest.Models;

namespace WURequest.Services
{
    // https://medium.com/@gtaposh/net-core-3-1-cron-jobs-background-service-e3026047b26d
    public class ForecastBackgroundService : BackgroundService
    {
        private readonly ForecastService _forecastService;
        private readonly IWeatherUndergroundApiSettings _weatherUndergroundApiSettings;
        private readonly CrontabSchedule _schedule;
        private readonly ILogger _logger;
        private DateTime _nextRun;

        // private static string Schedule => "*/10 * * * * *"; // every 10 seconds

        private static string Schedule => "0 * * * *"; // every 60 minutes
        
        public ForecastBackgroundService(
            ForecastService forecastService, IWeatherUndergroundApiSettings weatherUndergroundApiSettings, ILoggerFactory logFactory)
        {
            _schedule = CrontabSchedule.Parse(Schedule,new CrontabSchedule.ParseOptions { IncludingSeconds = false });
            _nextRun = _schedule.GetNextOccurrence(DateTime.Now);
            _forecastService = forecastService;
            _weatherUndergroundApiSettings = weatherUndergroundApiSettings;
            _logger = logFactory.CreateLogger<ForecastBackgroundService>();
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                do
                {
                    var now = DateTime.Now;
                    var nextrun = _schedule.GetNextOccurrence(now);
                    if (now > _nextRun)
                    {
                        Process();
                        _nextRun = _schedule.GetNextOccurrence(DateTime.Now);
                    }
                    await Task.Delay(5000, stoppingToken); //5 seconds delay
                }
                while (!stoppingToken.IsCancellationRequested);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
            
        }
        private async void Process()
        {
            try
            {
                await Forecast().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
            
        }
        private async Task Forecast()
        {
            try
            {
                //https://api.weather.com/v3/wx/forecast/daily/5day?geocode=-33.864643,18.659822&format=json&units=m&language=en-US&apiKey=d4748acffd2e4d8ab48acffd2e7d8abc
                string url = string.Format(
                    "https://api.weather.com/v3/wx/forecast/daily/5day?geocode={0},{1}&format={2}&units={3}&language={4}&apiKey={5}",
                    _weatherUndergroundApiSettings.Lat,
                    _weatherUndergroundApiSettings.Lon,
                    _weatherUndergroundApiSettings.Format,
                    _weatherUndergroundApiSettings.Units,
                    _weatherUndergroundApiSettings.Language,
                    _weatherUndergroundApiSettings.Pat
                );
                using HttpClient client = new HttpClient();
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));

                using HttpResponseMessage response = await client.GetAsync(url);
                try
                {
                    response.EnsureSuccessStatusCode();
                    string responseBody = await response.Content.ReadAsStringAsync();
                    var document = BsonSerializer.Deserialize<Forecasts>(responseBody);
                    await _forecastService.Create(document);
                }
                catch (Exception ex)
                {
                    _logger.LogInformation(ex.ToString());
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
        }
    }
}