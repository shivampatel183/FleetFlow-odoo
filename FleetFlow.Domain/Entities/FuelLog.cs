using System;

namespace FleetFlow.Domain.Entities
{
    public class FuelLog : BaseEntity
    {
        public int VehicleId { get; set; }
        public Vehicle Vehicle { get; set; } = null!;
        public decimal Liters { get; set; }
        public decimal Cost { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
    }
}
