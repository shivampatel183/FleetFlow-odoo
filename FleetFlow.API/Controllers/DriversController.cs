using FleetFlow.Domain.Entities;
using FleetFlow.Application.DTOs;
using FleetFlow.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace FleetFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DriversController : ControllerBase
    {
        private readonly IDriverRepository _driverRepository;
        private readonly ITripRepository _tripRepository;
        private readonly AutoMapper.IMapper _mapper;

        public DriversController(IDriverRepository driverRepository, ITripRepository tripRepository, AutoMapper.IMapper mapper)
        {
            _driverRepository = driverRepository;
            _tripRepository = tripRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var drivers = await _driverRepository.GetAllAsync();
            return Ok(_mapper.Map<System.Collections.Generic.IEnumerable<DriverDto>>(drivers));
        }

        [HttpGet("available")]
        public async Task<IActionResult> GetAvailable()
        {
            try
            {
                var drivers = await _driverRepository.GetAvailableDriversAsync();
                var dtos = _mapper.Map<System.Collections.Generic.IEnumerable<DriverDto>>(drivers);
                return Ok(dtos);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message, stack = ex.StackTrace });
            }
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var driver = await _driverRepository.GetByIdAsync(id);
            if (driver == null) return NotFound();
            return Ok(_mapper.Map<DriverDto>(driver));
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateDriverDto createDriverDto)
        {
            var driver = _mapper.Map<Domain.Entities.Driver>(createDriverDto);
            await _driverRepository.AddAsync(driver);
            await _driverRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = driver.Id }, _mapper.Map<DriverDto>(driver));
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, CreateDriverDto updateDriverDto)
        {
            var driver = await _driverRepository.GetByIdAsync(id);
            if (driver == null) return NotFound();

            _mapper.Map(updateDriverDto, driver);
            _driverRepository.Update(driver);
            await _driverRepository.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var driver = await _driverRepository.GetByIdAsync(id);
            if (driver == null) return NotFound();

            // Check if driver has associated trips and delete them first (Manual Cascade)
            var trips = await _tripRepository.GetAllAsync();
            var driverTrips = trips.Where(t => t.DriverId == id);
            foreach (var trip in driverTrips)
            {
                _tripRepository.Delete(trip);
            }
            await _tripRepository.SaveChangesAsync();

            _driverRepository.Delete(driver);
            await _driverRepository.SaveChangesAsync();
            return Ok(new { message = "Driver and associated trips deleted successfully" });
        }
    }
}
