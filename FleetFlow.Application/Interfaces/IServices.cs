using FleetFlow.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FleetFlow.Application.Interfaces
{
    public interface IVehicleService
    {
        Task<IEnumerable<VehicleDto>> GetAllVehiclesAsync();
        Task<VehicleDto?> GetVehicleByIdAsync(int id);
        Task<VehicleDto> CreateVehicleAsync(CreateVehicleDto createVehicleDto);
        Task<bool> UpdateVehicleStatusAsync(int id, string status);
    }

    public interface ITripService
    {
        Task<TripDto> DispatchTripAsync(CreateTripDto createTripDto);
        Task<bool> CompleteTripAsync(int tripId, decimal endOdometer);
        Task<IEnumerable<TripDto>> GetActiveTripsAsync();
    }
}
