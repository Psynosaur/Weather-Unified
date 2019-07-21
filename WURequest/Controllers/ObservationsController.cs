using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WURequest.Models;
using WURequest.Services;

namespace WURequest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ObservationsController : ControllerBase
    {
        private readonly ObservationService _observationService;

        public ObservationsController(ObservationService observationService)
        {
            _observationService = observationService;
        }

        [HttpGet]
        public ActionResult<List<Observation>> Get() =>
            _observationService.Latest();

        [HttpGet("{id:length(24)}", Name = "GetObservation")]
        public ActionResult<Observation> Get(string id)
        {
            var observation = _observationService.Get(id);

            if (observation == null)
            {
                return NotFound();
            }

            return observation;
        }

        [HttpPost]
        public ActionResult<Observation> Create(Observation observation)
        {
            _observationService.Create(observation);

            return CreatedAtRoute("GetObservation", new { id = observation.Id }, observation);
        }

        [HttpPut("{id:length(24)}")]
        public IActionResult Update(string id, Observation observationIn)
        {
            var observation = _observationService.Get(id);

            if (observation == null)
            {
                return NotFound();
            }

            _observationService.Update(id, observationIn);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public IActionResult Delete(string id)
        {
            var observation = _observationService.Get(id);

            if (observation == null)
            {
                return NotFound();
            }

            _observationService.Remove(observation.Id);

            return NoContent();
        }
    }
}
