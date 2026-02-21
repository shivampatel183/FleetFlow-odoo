using AutoMapper;
using FleetFlow.Application.DTOs;
using FleetFlow.Application.Interfaces;
using FleetFlow.Domain.Entities;
using FleetFlow.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FleetFlow.Application.Services
{
    public class TripService : ITripService
    {
        private readonly ITripRepository _tripRepository;
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IDriverRepository _driverRepository;
        private readonly IMapper _mapper;

        public TripService(
            ITripRepository tripRepository, 
            IVehicleRepository vehicleRepository, 
            IDriverRepository driverRepository, 
            IMapper mapper)
        {
            _tripRepository = tripRepository;
            _vehicleRepository = vehicleRepository;
            _driverRepository = driverRepository;
            _mapper = mapper;
        }

        public async Task<TripDto> DispatchTripAsync(CreateTripDto createTripDto)
        {
            var vehicle = await _vehicleRepository.GetByIdAsync(createTripDto.VehicleId);
            var driver = await _driverRepository.GetByIdAsync(createTripDto.DriverId);

            if (vehicle == null || driver == null)
                throw new Exception("Vehicle or Driver not found");

            if (vehicle.Status != VehicleStatus.Available)
                throw new Exception("Vehicle is not available");

            if (driver.Status != DriverStatus.Available)
                throw new Exception("Driver is not available");

            if (driver.LicenseExpiryDate < DateTime.UtcNow)
                throw new Exception("Driver's license is expired");

            if (createTripDto.CargoWeight > vehicle.MaxCapacityKg)
                throw new Exception("Cargo weight exceeds vehicle capacity");

            var trip = _mapper.Map<Trip>(createTripDto);
            trip.Status = TripStatus.Dispatched;
            trip.StartOdometer = vehicle.Odometer;

            // Update statuses
            vehicle.Status = VehicleStatus.OnTrip;
            driver.Status = DriverStatus.OnDuty;

            await _tripRepository.AddAsync(trip);
            await _tripRepository.SaveChangesAsync();

            return _mapper.Map<TripDto>(trip);
        }

        public async Task<bool> CompleteTripAsync(int tripId, decimal endOdometer)
        {
            var trip = await _tripRepository.GetByIdAsync(tripId);
            if (trip == null || trip.Status != TripStatus.Dispatched)
                return false;

            var vehicle = await _vehicleRepository.GetByIdAsync(trip.VehicleId);
            var driver = await _driverRepository.GetByIdAsync(trip.DriverId);

            trip.Status = TripStatus.Completed;
            trip.EndOdometer = endOdometer;

            if (vehicle != null)
            {
                vehicle.Status = VehicleStatus.Available;
                vehicle.Odometer = endOdometer;
            }

            if (driver != null)
            {
                driver.Status = DriverStatus.Available;
            }

            await _tripRepository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<TripDto>> GetActiveTripsAsync()
        {
            var trips = await _tripRepository.GetActiveTripsAsync();
            return _mapper.Map<IEnumerable<TripDto>>(trips);
        }
    }
}
