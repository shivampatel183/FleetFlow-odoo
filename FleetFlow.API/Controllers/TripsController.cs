using FleetFlow.Application.DTOs;
using FleetFlow.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FleetFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TripsController : ControllerBase
    {
        private readonly ITripService _tripService;

        public TripsController(ITripService tripService)
        {
            _tripService = tripService;
        }

        [HttpPost("dispatch")]
        public async Task<IActionResult> Dispatch(CreateTripDto createTripDto)
        {
            try
            {
                var trip = await _tripService.DispatchTripAsync(createTripDto);
                return Ok(trip);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/complete")]
        public async Task<IActionResult> Complete(int id, [FromBody] decimal endOdometer)
        {
            var result = await _tripService.CompleteTripAsync(id, endOdometer);
            if (!result) return BadRequest("Unable to complete trip");
            return Ok();
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActive()
        {
            var trips = await _tripService.GetActiveTripsAsync();
            return Ok(trips);
        }
    }
}
