using AutoMapper;
using FleetFlow.Application.DTOs;
using FleetFlow.Domain.Entities;

namespace FleetFlow.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Vehicle, VehicleDto>();
            CreateMap<CreateVehicleDto, Vehicle>();
            
            CreateMap<Driver, DriverDto>();
            CreateMap<CreateDriverDto, Driver>();

            CreateMap<Trip, TripDto>()
                .ForMember(dest => dest.VehiclePlate, opt => opt.MapFrom(src => src.Vehicle.LicensePlate))
                .ForMember(dest => dest.DriverName, opt => opt.MapFrom(src => src.Driver.Name));
            CreateMap<CreateTripDto, Trip>();

            CreateMap<MaintenanceLog, MaintenanceLogDto>();
            CreateMap<CreateMaintenanceLogDto, MaintenanceLog>();

            CreateMap<FuelLog, FuelLogDto>();
            CreateMap<CreateFuelLogDto, FuelLog>();
        }
    }
}
