using System;

namespace FleetFlow.Domain.Entities
{
    public class MaintenanceLog : BaseEntity
    {
        public int VehicleId { get; set; }
        public Vehicle Vehicle { get; set; } = null!;
        public string Description { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public DateTime ServiceDate { get; set; } = DateTime.UtcNow;
    }
}
