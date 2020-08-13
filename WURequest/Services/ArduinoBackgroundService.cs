using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MongoDB.Bson.Serialization;
using NCrontab;
using System.IO.Ports;
using Newtonsoft.Json.Linq;
using WURequest.Models;


namespace WURequest.Services
{
    // https://medium.com/@gtaposh/net-core-3-1-cron-jobs-background-service-e3026047b26d
    public class ArduinoBackgroundService : BackgroundService
    {
        private readonly ArduinoService _arduinoService;
        private readonly CrontabSchedule _schedule;
        private readonly ILogger _logger;
        private DateTime _nextRun;

        private static string Schedule => "*/10 * * * * *"; // every 10 seconds

        // private static string Schedule => "0 * * * *"; // every 60 minutes
        
        public ArduinoBackgroundService(
            ArduinoService arduinoService,  ILoggerFactory logFactory)
        {
            _schedule = CrontabSchedule.Parse(Schedule,new CrontabSchedule.ParseOptions { IncludingSeconds = true });
            _nextRun = _schedule.GetNextOccurrence(DateTime.Now);
            _arduinoService = arduinoService;
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
            SerialPort port = new SerialPort("COM12", 115200, Parity.None, 8, StopBits.One) {NewLine = "\r\n", ReadTimeout = 5000};
            try
            {
                // Call serial device and create entry into db
               
                port.Open();
                port.DiscardInBuffer();
                JObject jObj = JObject.Parse(port.ReadLine());
                var dhttemp = (double) jObj["dht1temp"];
                if (dhttemp > 0)
                {
                    await _arduinoService.Create(jObj.ToObject<ArduinoObservation>());
                }
                port.Close();
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                port.Close();
            }
        }
    }
}