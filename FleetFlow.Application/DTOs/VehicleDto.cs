using System;

namespace FleetFlow.Application.DTOs
{
    public class VehicleDto
    {
        public int Id { get; set; }
        public string Model { get; set; } = string.Empty;
        public string LicensePlate { get; set; } = string.Empty;
        public decimal MaxCapacityKg { get; set; }
        public decimal Odometer { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal AcquisitionCost { get; set; }
    }

    public class CreateVehicleDto
    {
        public string Model { get; set; } = string.Empty;
        public string LicensePlate { get; set; } = string.Empty;
        public decimal MaxCapacityKg { get; set; }
        public decimal Odometer { get; set; }
        public decimal AcquisitionCost { get; set; }
    }
}
