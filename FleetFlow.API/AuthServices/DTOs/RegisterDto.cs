using System.ComponentModel.DataAnnotations;

public record RegisterRequestDto
{
    [Required, MaxLength(255), EmailAddress]
    public string Email { get; init; }

    [Required, MinLength(8), MaxLength(100)]
    // Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char 
    public string Password { get; init; }

    [Required, Compare(nameof(Password))]
    public string ConfirmPassword { get; init; }

    [Required, MaxLength(100)]
    public string FirstName { get; init; }

    [Required, MaxLength(100)]
    public string LastName { get; init; }

    [Phone, MaxLength(20)]
    public string? PhoneNumber { get; init; }
}