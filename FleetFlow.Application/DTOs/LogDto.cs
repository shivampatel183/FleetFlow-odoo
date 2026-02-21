using System;

namespace FleetFlow.Application.DTOs
{
    public class MaintenanceLogDto
    {
        public int Id { get; set; }
        public int VehicleId { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public DateTime ServiceDate { get; set; }
    }

    public class CreateMaintenanceLogDto
    {
        public int VehicleId { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public DateTime ServiceDate { get; set; }
    }

    public class FuelLogDto
    {
        public int Id { get; set; }
        public int VehicleId { get; set; }
        public decimal Liters { get; set; }
        public decimal Cost { get; set; }
        public DateTime Date { get; set; }
    }

    public class CreateFuelLogDto
    {
        public int VehicleId { get; set; }
        public decimal Liters { get; set; }
        public decimal Cost { get; set; }
        public DateTime Date { get; set; }
    }
}
