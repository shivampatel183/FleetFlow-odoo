using FleetFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FleetFlow.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Trip> Trips { get; set; }
        public DbSet<MaintenanceLog> MaintenanceLogs { get; set; }
        public DbSet<FuelLog> FuelLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Vehicle>()
                .Property(v => v.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Driver>()
                .Property(d => d.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Trip>()
                .Property(t => t.Status)
                .HasConversion<string>();

            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            modelBuilder.Entity<Vehicle>()
                .HasIndex(v => v.LicensePlate)
                .IsUnique();
        }
    }
}
