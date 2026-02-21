namespace FleetFlow.Application.DTOs
{
    public class TripDto
    {
        public int Id { get; set; }
        public int VehicleId { get; set; }
        public string VehiclePlate { get; set; } = string.Empty;
        public int DriverId { get; set; }
        public string DriverName { get; set; } = string.Empty;
        public decimal CargoWeight { get; set; }
        public string StartLocation { get; set; } = string.Empty;
        public string EndLocation { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
    }

    public class CreateTripDto
    {
        public int VehicleId { get; set; }
        public int DriverId { get; set; }
        public decimal CargoWeight { get; set; }
        public string StartLocation { get; set; } = string.Empty;
        public string EndLocation { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
    }
}
