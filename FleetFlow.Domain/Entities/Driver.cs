using FleetFlow.Domain.Enums;
using System;
using System.Collections.Generic;

namespace FleetFlow.Domain.Entities
{
    public class Driver : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string LicenseNumber { get; set; } = string.Empty;
        public DateTime LicenseExpiryDate { get; set; }
        public DriverStatus Status { get; set; } = DriverStatus.Available;
        public decimal SafetyScore { get; set; } = 100;

        public ICollection<Trip> Trips { get; set; } = new List<Trip>();
    }
}
