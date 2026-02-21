using FleetFlow.Domain.Entities;
using FleetFlow.Application.DTOs;
using FleetFlow.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FleetFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaintenanceController : ControllerBase
    {
        private readonly IRepository<MaintenanceLog> _maintenanceRepository;
        private readonly IVehicleRepository _vehicleRepository;
        private readonly AutoMapper.IMapper _mapper;

        public MaintenanceController(IRepository<MaintenanceLog> maintenanceRepository, IVehicleRepository vehicleRepository, AutoMapper.IMapper mapper)
        {
            _maintenanceRepository = maintenanceRepository;
            _vehicleRepository = vehicleRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateMaintenanceLogDto logDto)
        {
            var log = _mapper.Map<MaintenanceLog>(logDto);
            await _maintenanceRepository.AddAsync(log);
            
            // Mark vehicle as InShop
            var vehicle = await _vehicleRepository.GetByIdAsync(log.VehicleId);
            if (vehicle != null)
            {
                vehicle.Status = Domain.Enums.VehicleStatus.InShop;
            }

            await _maintenanceRepository.SaveChangesAsync();
            return Ok(_mapper.Map<MaintenanceLogDto>(log));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var logs = await _maintenanceRepository.GetAllAsync();
            return Ok(_mapper.Map<System.Collections.Generic.IEnumerable<MaintenanceLogDto>>(logs));
        }

        [HttpGet("vehicle/{vehicleId:int}")]
        public async Task<IActionResult> GetByVehicle(int vehicleId)
        {
            var logs = await _maintenanceRepository.GetAllAsync();
            var filtered = logs.Where(l => l.VehicleId == vehicleId);
            return Ok(_mapper.Map<System.Collections.Generic.IEnumerable<MaintenanceLogDto>>(filtered));
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, CreateMaintenanceLogDto logDto)
        {
            var log = await _maintenanceRepository.GetByIdAsync(id);
            if (log == null) return NotFound();
            _mapper.Map(logDto, log);
            _maintenanceRepository.Update(log);
            await _maintenanceRepository.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var log = await _maintenanceRepository.GetByIdAsync(id);
            if (log == null) return NotFound();
            _maintenanceRepository.Delete(log);
            await _maintenanceRepository.SaveChangesAsync();
            return Ok(new { message = "Log deleted successfully" });
        }
    }
}
