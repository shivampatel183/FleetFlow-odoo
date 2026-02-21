-- FleetFlow System Database Schema
-- Target: SQL Server

-- 1. Users Table
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    Role NVARCHAR(50) NOT NULL CHECK (Role IN ('FleetManager', 'Dispatcher', 'SafetyOfficer', 'FinancialAnalyst')),
    IsActive BIT DEFAULT 1,
    CreatedDate DATETIME2 DEFAULT GETDATE(),
    UpdatedDate DATETIME2 DEFAULT GETDATE()
);

-- 2. Vehicles Table
CREATE TABLE Vehicles (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Model NVARCHAR(100) NOT NULL,
    LicensePlate NVARCHAR(20) UNIQUE NOT NULL,
    MaxCapacityKg DECIMAL(10, 2) NOT NULL CHECK (MaxCapacityKg > 0),
    Odometer DECIMAL(18, 2) DEFAULT 0,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Available' CHECK (Status IN ('Available', 'OnTrip', 'InShop', 'Retired')),
    AcquisitionCost DECIMAL(18, 2) NOT NULL,
    CreatedDate DATETIME2 DEFAULT GETDATE(),
    UpdatedDate DATETIME2 DEFAULT GETDATE()
);

-- 3. Drivers Table
CREATE TABLE Drivers (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    LicenseNumber NVARCHAR(50) UNIQUE NOT NULL,
    LicenseExpiryDate DATETIME2 NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Available' CHECK (Status IN ('Available', 'OnDuty', 'OffDuty', 'Suspended')),
    SafetyScore DECIMAL(5, 2) DEFAULT 100.00,
    CreatedDate DATETIME2 DEFAULT GETDATE(),
    UpdatedDate DATETIME2 DEFAULT GETDATE()
);

-- 4. Trips Table
CREATE TABLE Trips (
    Id INT PRIMARY KEY IDENTITY(1,1),
    VehicleId INT NOT NULL,
    DriverId INT NOT NULL,
    CargoWeight DECIMAL(10, 2) NOT NULL,
    StartLocation NVARCHAR(255),
    EndLocation NVARCHAR(255),
    StartOdometer DECIMAL(18, 2),
    EndOdometer DECIMAL(18, 2),
    Revenue DECIMAL(18, 2) DEFAULT 0,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Draft' CHECK (Status IN ('Draft', 'Dispatched', 'Completed', 'Cancelled')),
    CreatedDate DATETIME2 DEFAULT GETDATE(),
    UpdatedDate DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (VehicleId) REFERENCES Vehicles(Id),
    FOREIGN KEY (DriverId) REFERENCES Drivers(Id)
);

-- 5. MaintenanceLogs Table
CREATE TABLE MaintenanceLogs (
    Id INT PRIMARY KEY IDENTITY(1,1),
    VehicleId INT NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Cost DECIMAL(18, 2) NOT NULL,
    ServiceDate DATETIME2 DEFAULT GETDATE(),
    CreatedDate DATETIME2 DEFAULT GETDATE(),
    UpdatedDate DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (VehicleId) REFERENCES Vehicles(Id)
);

-- 6. FuelLogs Table
CREATE TABLE FuelLogs (
    Id INT PRIMARY KEY IDENTITY(1,1),
    VehicleId INT NOT NULL,
    Liters DECIMAL(10, 2) NOT NULL,
    Cost DECIMAL(18, 2) NOT NULL,
    Date DATETIME2 DEFAULT GETDATE(),
    CreatedDate DATETIME2 DEFAULT GETDATE(),
    UpdatedDate DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (VehicleId) REFERENCES Vehicles(Id)
);

-- Indexes for performance
CREATE INDEX IX_Trips_VehicleId ON Trips(VehicleId);
CREATE INDEX IX_Trips_DriverId ON Trips(DriverId);
CREATE INDEX IX_MaintenanceLogs_VehicleId ON MaintenanceLogs(VehicleId);
CREATE INDEX IX_FuelLogs_VehicleId ON FuelLogs(VehicleId);

-- Sample Data (Seed Primary Admin)
-- Password: "AdminPassword123"
INSERT INTO Users (Name, Email, PasswordHash, Role, IsActive)
VALUES ('Admin User', 'admin@fleetflow.com', '$2a$11$blZZqgNSLZR8k1CA2mE2yehq/tMv5CVO/nF9u3ukZcFLJdbJ5ZYIO', 'FleetManager', 1);
