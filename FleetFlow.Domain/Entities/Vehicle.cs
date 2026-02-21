using FleetFlow.Domain.Enums;
using System.Collections.Generic;

namespace FleetFlow.Domain.Entities
{
    public class Vehicle : BaseEntity
    {
        public string Model { get; set; } = string.Empty;
        public string LicensePlate { get; set; } = string.Empty;
        public decimal MaxCapacityKg { get; set; }
        public decimal Odometer { get; set; }
        public VehicleStatus Status { get; set; } = VehicleStatus.Available;
        public decimal AcquisitionCost { get; set; }

        public ICollection<Trip> Trips { get; set; } = new List<Trip>();
        public ICollection<MaintenanceLog> MaintenanceLogs { get; set; } = new List<MaintenanceLog>();
        public ICollection<FuelLog> FuelLogs { get; set; } = new List<FuelLog>();
    }
}
