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
    public class VehiclesController : ControllerBase
    {
        private readonly IVehicleRepository _vehicleRepository;
        private readonly ITripRepository _tripRepository;
        private readonly IRepository<MaintenanceLog> _maintenanceRepository;
        private readonly IRepository<FuelLog> _fuelRepository;
        private readonly AutoMapper.IMapper _mapper;

        public VehiclesController(
            IVehicleRepository vehicleRepository, 
            ITripRepository tripRepository,
            IRepository<MaintenanceLog> maintenanceRepository,
            IRepository<FuelLog> fuelRepository,
            AutoMapper.IMapper mapper)
        {
            _vehicleRepository = vehicleRepository;
            _tripRepository = tripRepository;
            _maintenanceRepository = maintenanceRepository;
            _fuelRepository = fuelRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var vehicles = await _vehicleRepository.GetAllAsync();
            return Ok(_mapper.Map<System.Collections.Generic.IEnumerable<VehicleDto>>(vehicles));
        }

        [HttpGet("available")]
        public async Task<IActionResult> GetAvailable()
        {
            try
            {
                var vehicles = await _vehicleRepository.GetAvailableVehiclesAsync();
                var dtos = _mapper.Map<System.Collections.Generic.IEnumerable<VehicleDto>>(vehicles);
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
            var vehicle = await _vehicleRepository.GetByIdAsync(id);
            if (vehicle == null) return NotFound();
            return Ok(_mapper.Map<VehicleDto>(vehicle));
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateVehicleDto createVehicleDto)
        {
            var vehicle = _mapper.Map<Domain.Entities.Vehicle>(createVehicleDto);
            await _vehicleRepository.AddAsync(vehicle);
            await _vehicleRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = vehicle.Id }, _mapper.Map<VehicleDto>(vehicle));
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, CreateVehicleDto updateVehicleDto)
        {
            var vehicle = await _vehicleRepository.GetByIdAsync(id);
            if (vehicle == null) return NotFound();

            _mapper.Map(updateVehicleDto, vehicle);
            _vehicleRepository.Update(vehicle);
            await _vehicleRepository.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var vehicle = await _vehicleRepository.GetByIdAsync(id);
            if (vehicle == null) return NotFound();

            // Manual Cascade Delete for associated records
            var trips = (await _tripRepository.GetAllAsync()).Where(t => t.VehicleId == id);
            foreach (var t in trips) _tripRepository.Delete(t);
            await _tripRepository.SaveChangesAsync();

            var maints = (await _maintenanceRepository.GetAllAsync()).Where(m => m.VehicleId == id);
            foreach (var m in maints) _maintenanceRepository.Delete(m);
            await _maintenanceRepository.SaveChangesAsync();

            var fuels = (await _fuelRepository.GetAllAsync()).Where(f => f.VehicleId == id);
            foreach (var f in fuels) _fuelRepository.Delete(f);
            await _fuelRepository.SaveChangesAsync();

            _vehicleRepository.Delete(vehicle);
            await _vehicleRepository.SaveChangesAsync();
            return Ok(new { message = "Vehicle and all associated logs deleted successfully" });
        }
    }
}
