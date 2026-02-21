using FleetFlow.Domain.Entities;
using FleetFlow.Application.DTOs;
using FleetFlow.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FleetFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FuelController : ControllerBase
    {
        private readonly IRepository<FuelLog> _fuelRepository;
        private readonly AutoMapper.IMapper _mapper;

        public FuelController(IRepository<FuelLog> fuelRepository, AutoMapper.IMapper mapper)
        {
            _fuelRepository = fuelRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateFuelLogDto logDto)
        {
            var log = _mapper.Map<FuelLog>(logDto);
            await _fuelRepository.AddAsync(log);
            await _fuelRepository.SaveChangesAsync();
            return Ok(_mapper.Map<FuelLogDto>(log));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var logs = await _fuelRepository.GetAllAsync();
            return Ok(_mapper.Map<System.Collections.Generic.IEnumerable<FuelLogDto>>(logs));
        }

        [HttpGet("vehicle/{vehicleId:int}")]
        public async Task<IActionResult> GetByVehicle(int vehicleId)
        {
            var logs = await _fuelRepository.GetAllAsync();
            var filtered = logs.Where(l => l.VehicleId == vehicleId);
            return Ok(_mapper.Map<System.Collections.Generic.IEnumerable<FuelLogDto>>(filtered));
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, CreateFuelLogDto logDto)
        {
            var log = await _fuelRepository.GetByIdAsync(id);
            if (log == null) return NotFound();
            _mapper.Map(logDto, log);
            _fuelRepository.Update(log);
            await _fuelRepository.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var log = await _fuelRepository.GetByIdAsync(id);
            if (log == null) return NotFound();
            _fuelRepository.Delete(log);
            await _fuelRepository.SaveChangesAsync();
            return Ok(new { message = "Log deleted successfully" });
        }
    }
}
