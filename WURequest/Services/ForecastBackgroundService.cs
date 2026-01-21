using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NCrontab;

namespace WURequest.Services
{
    // https://medium.com/@gtaposh/net-core-3-1-cron-jobs-background-service-e3026047b26d
    public class ForecastBackgroundService : BackgroundService
    {
        private readonly IForecastService _forecastService;
        private readonly IForecastApiService _forecastApiService;
        private readonly CrontabSchedule _schedule;
        private readonly ILogger _logger;
        private DateTime _nextRun;

        // private static string Schedule => "*/10 * * * * *"; // every 10 seconds
        private static string Schedule => "0 * * * *"; // every 60 minutes
        
        public ForecastBackgroundService(
            IForecastService forecastService,
            IForecastApiService forecastApiService,
            ILoggerFactory logFactory)
        {
            _schedule = CrontabSchedule.Parse(Schedule, new CrontabSchedule.ParseOptions { IncludingSeconds = false });
            _nextRun = _schedule.GetNextOccurrence(DateTime.Now);
            _forecastService = forecastService;
            _forecastApiService = forecastApiService;
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
                        await ProcessAsync();
                        _nextRun = _schedule.GetNextOccurrence(DateTime.Now);
                    }
                    await Task.Delay(5000, stoppingToken); //5 seconds delay
                }
                while (!stoppingToken.IsCancellationRequested);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in ForecastBackgroundService execution");
                throw;
            }
        }

        private async Task ProcessAsync()
        {
            try
            {
                await FetchAndStoreForecastAsync().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing forecast data");
                throw;
            }
        }

        private async Task FetchAndStoreForecastAsync()
        {
            try
            {
                var forecast = await _forecastApiService.GetForecastAsync();
                if (forecast != null)
                {
                    await _forecastService.Create(forecast);
                    _logger.LogInformation("Successfully fetched and stored forecast data");
                }
                else
                {
                    _logger.LogWarning("Received null forecast data from API");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching and storing forecast data");
                throw;
            }
        }
    }
}
