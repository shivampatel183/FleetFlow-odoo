using FleetFlow.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FleetFlow.Application.Interfaces
{
    public interface IVehicleRepository : IRepository<Vehicle>
    {
        Task<IEnumerable<Vehicle>> GetAvailableVehiclesAsync();
    }

    public interface IDriverRepository : IRepository<Driver>
    {
        Task<IEnumerable<Driver>> GetAvailableDriversAsync();
    }

    public interface ITripRepository : IRepository<Trip>
    {
        Task<IEnumerable<Trip>> GetActiveTripsAsync();
    }
}
