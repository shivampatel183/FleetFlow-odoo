public class User : BaseEntity
{
    public Guid TenantId { get; set; }
    public int UserType { get; set; }

    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;

    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? PhoneNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? AvatarUrl { get; set; }

    public bool IsEmailVerified { get; set; }
    public bool IsPhoneVerified { get; set; }
    public bool IsActive { get; set; } = true;

    public bool MfaEnabled { get; set; }
    public string? MfaSecret { get; set; }

    public string? OAuthProvider { get; set; }
    public string? OAuthId { get; set; }

    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiry { get; set; }

    public DateTime? LastLoginAt { get; set; }
    public byte FailedLoginCount { get; set; }
    public DateTime? LockoutUntil { get; set; }

    public bool IsDeleted { get; set; }

    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
