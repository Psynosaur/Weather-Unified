using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
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
        public ActionResult<List<Observations>> Get() =>
            _observationsService.Latest();

        [HttpGet("{id:length(24)}", Name = "GetObservation")]
        public ActionResult<Observations> Get(string id)
        {
            var observation = _observationsService.Get(id);

            if (observation == null)
            {
                return NotFound();
            }

            return observation;
        }

        [HttpPost]
        public ActionResult<Observations> Create(Observations observations)
        {
            _observationsService.Create(observations);

            return CreatedAtRoute("GetObservation", new { id = observations.Id }, observations);
        }

        [HttpPut("{id:length(24)}")]
        public IActionResult Update(string id, Observations observationsIn)
        {
            var observation = _observationsService.Get(id);

            if (observation == null)
            {
                return NotFound();
            }

            _observationsService.Update(id, observationsIn);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public IActionResult Delete(string id)
        {
            var observation = _observationsService.Get(id);

            if (observation == null)
            {
                return NotFound();
            }

            _observationsService.Remove(observation.Id);

            return NoContent();
        }
    }
}
