using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WURequest.Models;
using WURequest.Services;

namespace WURequest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ForecastsController : ControllerBase
    {
        private readonly IForecastService _forecastService;
        private readonly ILogger _logger;

        public ForecastsController(
            IForecastService forecastService,
            ILoggerFactory logFactory)
        {
            _forecastService = forecastService;
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
    }
}
