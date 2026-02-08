using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using WURequest.Hubs;
using WURequest.Models;
using WURequest.Services;

namespace WURequest.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IObservationsService _observationsService;
        private readonly IWeatherUndergroundApiSettings _weatherUndergroundApiSettings;
        private readonly IHubContext<WeatherHub> _weatherHubContext;
        private readonly ILogger _logger;
        
        public WeatherController(
            IObservationsService observationsService,
            IWebHostEnvironment hostingEnvironment, 
            IWeatherUndergroundApiSettings weatherUndergroundApiSettings,
            IHubContext<WeatherHub> weatherHubContext,
            ILoggerFactory logFactory)
        {
            _observationsService = observationsService;
            _hostingEnvironment = hostingEnvironment;
            _weatherUndergroundApiSettings = weatherUndergroundApiSettings;
            _weatherHubContext = weatherHubContext;
            _logger = logFactory.CreateLogger<WeatherController>();
        }

        /*
            Meteobridge Data getter
            - This is where Meteobridge sends the weather data to
            - It stores the result in the mongodb
            - Broadcasts via SignalR for real-time updates
        */
        [HttpGet]
        public async Task<ActionResult<string>> Mb([FromQuery] Observations data)
        {
            try
            {
                if (data.ObsTime != default && !double.IsNaN(data.TempOutCur))
                {
                    await _observationsService.Create(data);
                    _logger.LogInformation("Created new observation at {ObsTime}", data.ObsTime);
                    
                    // Broadcast new observation via SignalR for real-time updates
                    try
                    {
                        await _weatherHubContext.Clients.All.SendAsync("ReceiveObservationUpdate", data);
                        _logger.LogInformation("✅ Broadcasted observation update via SignalR");
                    }
                    catch (Exception signalREx)
                    {
                        _logger.LogWarning(signalREx, "⚠️ Failed to broadcast observation via SignalR");
                    }
                    
                    return "DATA OK";
                }
                return "DATA BAD";
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
        }
    }
}
