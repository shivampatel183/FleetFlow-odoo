using Microsoft.AspNetCore.Mvc;
using TheSeatLineApi.AuthServices.DTOs;
using TheSeatLineApi.AuthServices.Repository;
using TheSeatLineApi.Common;

namespace TheSeatLineApi.AuthServices.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<Response<AuthResponseDto>> Register(RegisterRequestDto dto)
        {
            try
            {
                return Response<AuthResponseDto>.Ok(await _authService.RegisterAsync(dto), "Registration success");
            }
            catch (Exception ex)
            {
                return Response<AuthResponseDto>.Fail(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<Response<AuthResponseDto>> Login(LoginRequestDto dto)
        {
            try
            {
                return Response<AuthResponseDto>.Ok(await _authService.LoginAsync(dto));
            }
            catch (Exception ex)
            {
                return Response<AuthResponseDto>.Fail(ex.Message);
            }
        }

        [HttpPost("refresh-token")]
        public async Task<Response<AuthResponseDto>> RefreshToken(RefreshTokenDto dto)
        {
            try
            {
                return Response<AuthResponseDto>.Ok(await _authService.RefreshTokenAsync(dto));
            }
            catch (Exception ex)
            {
                return Response<AuthResponseDto>.Fail(ex.Message);
            }
        }
    }
}
