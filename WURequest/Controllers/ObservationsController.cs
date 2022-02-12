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
    }
}
