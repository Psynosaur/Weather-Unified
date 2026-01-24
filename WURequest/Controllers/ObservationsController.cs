using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using WURequest.Models;
using WURequest.Services;

namespace WURequest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ObservationsController : ControllerBase
    {
        private readonly IObservationsService _observationsService;
        private readonly ILogger _logger;

        public ObservationsController(
            IObservationsService observationsService,
            ILoggerFactory logFactory)
        {
            _observationsService = observationsService;
            _logger = logFactory.CreateLogger<ObservationsController>();;
        }

        [HttpGet]
        public async Task<ActionResult<List<Observations>>> Get() =>
            await _observationsService.Latest();

        [HttpGet("{id:length(24)}", Name = "GetObservation")]
        public async Task<ActionResult<Observations>> Get(string id)
        {
            try
            {
                var observation = await _observationsService.Get(id);
                if (observation == null)
                {
                    return NotFound();
                }
                return observation.FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
            
        }

        [HttpPost]
        public async Task<ActionResult<Observations>> Create(Observations observations)
        {
            try
            {
                await _observationsService.Create(observations);
                return CreatedAtRoute("GetObservation", new { id = observations.Id }, observations);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
           
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, Observations observationsIn)
        {
            try
            {
                var observation = await _observationsService.Get(id);
                if (observation.FirstOrDefault() == null)
                {
                    return NotFound();
                }
                _observationsService.Update(id, observationsIn);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
            
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var observation =await _observationsService.Get(id);
                if (observation.FirstOrDefault() == null)
                {
                    return NotFound();
                }
                _observationsService.Remove(observation.FirstOrDefault().Id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
        }

        [HttpGet("hourly/{hour}")]
        public async Task<ActionResult<List<Observations>>> GetHourly(int hour)
        {
            try
            {
                return await _observationsService.Hourly(hour);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching hourly observations for hour {Hour}", hour);
                throw;
            }
        }

        [HttpGet("daily")]
        public async Task<ActionResult<List<Observations>>> GetDaily()
        {
            try
            {
                return await _observationsService.Daily();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching daily observations");
                throw;
            }
        }

        [HttpGet("weekly")]
        public async Task<ActionResult<List<Observations>>> GetWeekly([FromQuery] string date = null)
        {
            try
            {
                return await _observationsService.Weekly(date);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching weekly observations");
                throw;
            }
        }

        [HttpGet("monthly")]
        public async Task<ActionResult<List<Observations>>> GetMonthly([FromQuery] string date = null)
        {
            try
            {
                return await _observationsService.Monthly(date);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching monthly observations");
                throw;
            }
        }

        [HttpGet("date/{date}")]
        public async Task<ActionResult<List<Observations>>> GetByDate(string date)
        {
            try
            {
                return await _observationsService.Date(date);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching observations for date {Date}", date);
                throw;
            }
        }

        [HttpGet("rain")]
        public ActionResult<List<List<RainObs>>> GetRainData([FromQuery] string start, [FromQuery] string end)
        {
            try
            {
                return _observationsService.Rain(start, end);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching rain data from {Start} to {End}", start, end);
                throw;
            }
        }

        [HttpGet("count")]
        public ActionResult<long> GetCount()
        {
            try
            {
                return _observationsService.Count();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching observation count");
                throw;
            }
        }
    }
}
