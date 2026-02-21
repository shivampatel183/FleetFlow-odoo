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
            var totalRevenue = await _context.Trips.Where(t => t.Status == Domain.Enums.TripStatus.Completed).SumAsync(t => t.Revenue);
            
            // Recent Activities
            var recentTrips = await _context.Trips
                .OrderByDescending(t => t.CreatedDate)
                .Take(5)
                .Select(t => new { t.Id, t.StartLocation, t.EndLocation, Type = "Trip", t.Status, Date = t.CreatedDate })
                .ToListAsync();

            var recentMaint = await _context.MaintenanceLogs
                .OrderByDescending(m => m.CreatedDate)
                .Take(3)
                .Select(m => new { m.Id, Description = m.Description, Type = "Maintenance", Status = "Service", Date = m.CreatedDate })
                .ToListAsync();

            var activities = recentTrips.Select(t => new { 
                Title = $"Trip {t.StartLocation} to {t.EndLocation}", 
                Time = t.Date, 
                Icon = "🚚", 
                Status = t.Status.ToString(),
                StatusClass = $"status-{t.Status.ToString().ToLower()}"
            }).Concat(recentMaint.Select(m => new {
                Title = $"Maintenance: {m.Description}",
                Time = m.Date,
                Icon = "🛠️",
                Status = "InShop",
                StatusClass = "status-inshop"
            })).OrderByDescending(a => a.Time).Take(6).ToList();

            return Ok(new
            {
                TotalVehicles = totalVehicles,
                OnTrip = onTripVehicles,
                InShop = inShopVehicles,
                UtilizationRate = utilizationRate,
                TotalOperationalCost = totalFuelCost + totalMaintenanceCost,
                TotalRevenue = totalRevenue,
                PendingTrips = await _context.Trips.CountAsync(t => t.Status == Domain.Enums.TripStatus.Draft),
                Activities = activities,
                FleetHealth = new [] {
                    new { Label = "Available", Value = totalVehicles - onTripVehicles - inShopVehicles, Color = "#10b981", Percentage = totalVehicles > 0 ? (double)(totalVehicles - onTripVehicles - inShopVehicles) / totalVehicles * 100 : 0 },
                    new { Label = "On Trip", Value = onTripVehicles, Color = "#6366f1", Percentage = totalVehicles > 0 ? (double)onTripVehicles / totalVehicles * 100 : 0 },
                    new { Label = "In Shop", Value = inShopVehicles, Color = "#f43f5e", Percentage = totalVehicles > 0 ? (double)inShopVehicles / totalVehicles * 100 : 0 }
                }
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
