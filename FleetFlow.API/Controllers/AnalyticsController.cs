using FleetFlow.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace FleetFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly Infrastructure.Persistence.ApplicationDbContext _context;

        public AnalyticsController(Infrastructure.Persistence.ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("kpis")]
        public async Task<IActionResult> GetKpis()
        {
            var totalVehicles = await _context.Vehicles.CountAsync();
            var onTripVehicles = await _context.Vehicles.CountAsync(v => v.Status == Domain.Enums.VehicleStatus.OnTrip);
            var inShopVehicles = await _context.Vehicles.CountAsync(v => v.Status == Domain.Enums.VehicleStatus.InShop);
            
            var utilizationRate = totalVehicles > 0 ? (double)onTripVehicles / totalVehicles * 100 : 0;
            
            var totalFuelCost = await _context.FuelLogs.SumAsync(f => f.Cost);
            var totalMaintenanceCost = await _context.MaintenanceLogs.SumAsync(m => m.Cost);

            return Ok(new
            {
                TotalVehicles = totalVehicles,
                OnTrip = onTripVehicles,
                InShop = inShopVehicles,
                UtilizationRate = utilizationRate,
                TotalOperationalCost = totalFuelCost + totalMaintenanceCost,
                PendingTrips = await _context.Trips.CountAsync(t => t.Status == Domain.Enums.TripStatus.Draft)
            });
        }

        [HttpGet("cost-report")]
        public async Task<IActionResult> GetCostReport()
        {
            var data = await _context.Vehicles
                .Select(v => new
                {
                    v.LicensePlate,
                    v.Model,
                    FuelCost = v.FuelLogs.Sum(f => f.Cost),
                    MaintenanceCost = v.MaintenanceLogs.Sum(m => m.Cost),
                    TotalCost = v.FuelLogs.Sum(f => f.Cost) + v.MaintenanceLogs.Sum(m => m.Cost)
                })
                .ToListAsync();

            return Ok(data);
        }
    }
}
