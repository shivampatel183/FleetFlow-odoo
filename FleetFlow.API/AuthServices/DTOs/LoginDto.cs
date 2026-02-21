using System.ComponentModel.DataAnnotations;

public record LoginRequestDto
{
    [Required, EmailAddress]
    public string Email { get; init; }

    [Required]
    public string Password { get; init; }

    public bool RememberMe { get; init; } = false;
    public string? MfaCode { get; init; }  // 6-digit TOTP 
}