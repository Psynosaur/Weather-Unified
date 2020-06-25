using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using WURequest.Models;
using WURequest.Services;

namespace WURequest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ObservationsController : ControllerBase
    {
        private readonly ObservationsService _observationsService;

        public ObservationsController(ObservationsService observationsService)
        {
            _observationsService = observationsService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Observations>>> Get() =>
            await _observationsService.Latest();

        [HttpGet("{id:length(24)}", Name = "GetObservation")]
        public async Task<ActionResult<Observations>> Get(string id)
        {
            var observation = await _observationsService.Get(id);

            if (observation == null)
            {
                return NotFound();
            }

            return observation.FirstOrDefault();
        }

        [HttpPost]
        public async Task<ActionResult<Observations>> Create(Observations observations)
        {
            await _observationsService.Create(observations);

            return CreatedAtRoute("GetObservation", new { id = observations.Id }, observations);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, Observations observationsIn)
        {
            var observation = await _observationsService.Get(id);

            if (observation.FirstOrDefault() == null)
            {
                return NotFound();
            }

            _observationsService.Update(id, observationsIn);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var observation =await _observationsService.Get(id);

            if (observation.FirstOrDefault() == null)
            {
                return NotFound();
            }

            _observationsService.Remove(observation.FirstOrDefault().Id);

            return NoContent();
        }
    }
}
