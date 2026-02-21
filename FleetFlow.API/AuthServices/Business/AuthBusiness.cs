using Google.Apis.Auth;
using TheSeatLineApi.AuthServices.DTOs;
using TheSeatLineApi.AuthServices.Helpers;
using TheSeatLineApi.AuthServices.Repository;
using TheSeatLineApi.Common.Enums;

namespace TheSeatLineApi.AuthServices.Business
{
    public class AuthBusiness : IAuthService
    {
        private readonly IUserRepository _userRepo;
        private readonly JwtTokenGenerator _jwt;
        private readonly IConfiguration _config;

        public AuthBusiness(IUserRepository userRepo, JwtTokenGenerator jwt, IConfiguration config)
        {
            _userRepo = userRepo;
            _jwt = jwt;
            _config = config;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto)
        {
            if (await _userRepo.GetByEmailAsync(dto.Email) != null)
                throw new Exception("User already exists");

            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PasswordHash = PasswordHasher.Hash(dto.Password),
                IsEmailVerified = false,
                UserType = (int)UserRole.User,
                IsActive = true
            };

            user.RefreshToken = _jwt.GenerateRefreshToken();
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            user.Id = await _userRepo.AddAsync(user);

            return BuildAuthResponse(user);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
        {
            var user = await _userRepo.GetByEmailAsync(dto.Email)
                ?? throw new Exception("Invalid credentials");

            if (string.IsNullOrEmpty(user.PasswordHash))
                throw new Exception("Please login with Google");

            if (!PasswordHasher.Verify(dto.Password, user.PasswordHash))
                throw new Exception("Invalid credentials");

            user.RefreshToken = _jwt.GenerateRefreshToken();
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

            await _userRepo.UpdateAsync(user);

            return BuildAuthResponse(user);
        }

        public async Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenDto dto)
        {
            var principal = _jwt.GetPrincipalFromExpiredToken(dto.AccessToken);
            var email = principal?.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;

            if (email == null)
                throw new Exception("Invalid Token");

            var user = await _userRepo.GetByEmailAsync(email);

            if (user == null || user.RefreshToken != dto.RefreshToken || user.RefreshTokenExpiry <= DateTime.UtcNow)
                throw new Exception("Invalid Refresh Token");

            var newRefreshToken = _jwt.GenerateRefreshToken();
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

            await _userRepo.UpdateAsync(user);

            return BuildAuthResponse(user);
        }

        private AuthResponseDto BuildAuthResponse(User user)
        {
            var userProfile = new UserProfileDto
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                IsEmailVerified = user.IsEmailVerified,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };
            return new AuthResponseDto {
                AccessToken = _jwt.GenerateToken(user.Id, user.Email, user.FirstName, (UserRole)user.UserType),
                RefreshToken = user.RefreshToken ?? string.Empty,
                ExpiresAt = (DateTime)user.RefreshTokenExpiry,
                User = userProfile
            };
        }
    }
}
