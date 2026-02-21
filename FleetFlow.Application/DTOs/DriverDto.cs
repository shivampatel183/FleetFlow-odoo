using System;

namespace FleetFlow.Application.DTOs
{
    public class DriverDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string LicenseNumber { get; set; } = string.Empty;
        public DateTime LicenseExpiryDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal SafetyScore { get; set; }
    }

    public class CreateDriverDto
    {
        public string Name { get; set; } = string.Empty;
        public string LicenseNumber { get; set; } = string.Empty;
        public DateTime LicenseExpiryDate { get; set; }
    }
}
