using FleetFlow.Domain.Enums;

namespace FleetFlow.Domain.Entities
{
    public class Trip : BaseEntity
    {
        public int VehicleId { get; set; }
        public Vehicle Vehicle { get; set; } = null!;
        public int DriverId { get; set; }
        public Driver Driver { get; set; } = null!;

        public decimal CargoWeight { get; set; }
        public string StartLocation { get; set; } = string.Empty;
        public string EndLocation { get; set; } = string.Empty;
        public decimal? StartOdometer { get; set; }
        public decimal? EndOdometer { get; set; }
        public decimal Revenue { get; set; }
        public TripStatus Status { get; set; } = TripStatus.Draft;
    }
}
