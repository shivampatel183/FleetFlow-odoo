using FleetFlow.Application.Interfaces;
using FleetFlow.Domain.Entities;
using FleetFlow.Domain.Enums;
using FleetFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FleetFlow.Infrastructure.Repositories
{
    public class VehicleRepository : Repository<Vehicle>, IVehicleRepository
    {
        public VehicleRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Vehicle>> GetAvailableVehiclesAsync()
        {
            return await _context.Vehicles
                .Where(v => v.Status == VehicleStatus.Available)
                .ToListAsync();
        }
    }

    public class DriverRepository : Repository<Driver>, IDriverRepository
    {
        public DriverRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Driver>> GetAvailableDriversAsync()
        {
            return await _context.Drivers
                .Where(d => d.Status == DriverStatus.Available)
                .ToListAsync();
        }
    }

    public class TripRepository : Repository<Trip>, ITripRepository
    {
        public TripRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Trip>> GetActiveTripsAsync()
        {
            return await _context.Trips
                .Include(t => t.Vehicle)
                .Include(t => t.Driver)
                .Where(t => t.Status == TripStatus.Dispatched)
                .ToListAsync();
        }
    }
}
