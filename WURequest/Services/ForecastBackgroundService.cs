using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using NCrontab;

namespace WURequest.Services
{
    // https://medium.com/@gtaposh/net-core-3-1-cron-jobs-background-service-e3026047b26d
    public class ForecastBackgroundService : BackgroundService
    {
        private readonly ForecastService _forecastService;
        private readonly CrontabSchedule _schedule;
        private DateTime _nextRun;

        // private static string Schedule => "*/10 * * * * *"; // every 10 seconds

        private static string Schedule => "* */60 * * * *"; // every 60 minutes
        
        public ForecastBackgroundService(
            ForecastService forecastService)
        {
            _schedule = CrontabSchedule.Parse(Schedule,new CrontabSchedule.ParseOptions { IncludingSeconds = true });
            _nextRun = _schedule.GetNextOccurrence(DateTime.Now);
            _forecastService = forecastService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
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

        private async void Process()
        {
            // Get token and gps from settings
            await Forecast("8d259e27e2dddee03d282aa4720bb02c");
        }

        private async Task Forecast(string pat)
        {
            try
            {
                const string units = "auto";
                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Accept.Add(
                        new MediaTypeWithQualityHeaderValue("application/json"));

                    using (HttpResponseMessage response = await client.GetAsync(
                        string.Format(
                            "https://api.darksky.net/forecast/{0}/-33.864643,18.659822?units={1}",
                            pat, units)))
                    {
                        try
                        {
                            response.EnsureSuccessStatusCode();
                            string responseBody = await response.Content.ReadAsStringAsync();
                            var document = BsonSerializer.Deserialize<BsonDocument>(responseBody);
                            await _forecastService.Create(document);
                        }
                        catch (Exception e)
                        {
                            Console.WriteLine(e.ToString());
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                throw;
            }
        }
    }
}