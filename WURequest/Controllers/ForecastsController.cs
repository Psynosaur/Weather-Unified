using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using WURequest.Models;
using WURequest.Services;
using WURequest.Hubs;

namespace WURequest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ForecastsController : ControllerBase
    {
        private readonly IForecastService _forecastService;
        private readonly IForecastApiService _forecastApiService;
        private readonly IHubContext<WeatherHub> _weatherHubContext;
        private readonly ILogger _logger;

        public ForecastsController(
            IForecastService forecastService,
            IForecastApiService forecastApiService,
            IHubContext<WeatherHub> weatherHubContext,
            ILoggerFactory logFactory)
        {
            _forecastService = forecastService;
            _forecastApiService = forecastApiService;
            _weatherHubContext = weatherHubContext;
            _logger = logFactory.CreateLogger<ForecastsController>();
        }

        [HttpGet]
        public async Task<ActionResult<Forecasts>> Get()
        {
            try
            {
                var forecasts = await _forecastService.Latest();
                return forecasts?.FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching latest forecast");
                throw;
            }
        }

        [HttpGet("latest")]
        public async Task<ActionResult<Forecasts>> GetLatest()
        {
            try
            {
                var forecasts = await _forecastService.Latest();
                return forecasts?.FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching latest forecast");
                throw;
            }
        }

        [HttpGet("refresh")]
        public async Task<ActionResult<Forecasts>> Refresh()
        {
            try
            {
                _logger.LogInformation("Manual forecast refresh triggered");
                
                // Fetch new forecast from API
                var forecast = await _forecastApiService.GetForecastAsync();
                
                if (forecast == null)
                {
                    _logger.LogWarning("Received null forecast data from API");
                    return BadRequest("Failed to fetch forecast data from external API");
                }
                
                // Store in database
                await _forecastService.Create(forecast);
                _logger.LogInformation("Successfully fetched and stored forecast data");
                
                // Broadcast via SignalR
                try
                {
                    await _weatherHubContext.Clients.All.SendAsync("ReceiveForecastUpdate", forecast);
                    _logger.LogInformation("Broadcasted forecast update via SignalR");
                }
                catch (Exception signalREx)
                {
                    _logger.LogWarning(signalREx, "Failed to broadcast forecast via SignalR");
                }
                
                return Ok(forecast);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during manual forecast refresh");
                return StatusCode(500, "Error refreshing forecast data");
            }
        }
    }
}
