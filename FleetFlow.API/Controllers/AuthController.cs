using FleetFlow.Application.Interfaces;
using FleetFlow.Infrastructure.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace FleetFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly Infrastructure.Persistence.ApplicationDbContext _context;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtService _jwtService;

        public AuthController(Infrastructure.Persistence.ApplicationDbContext context, IPasswordHasher passwordHasher, IJwtService jwtService)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid email or password");
            }

            var token = _jwtService.GenerateToken(user.Id, user.Name, user.Role.ToString());

            return Ok(new
            {
                Token = token,
                User = new { user.Id, user.Name, user.Email, user.Role }
            });
        }

        public class LoginRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }
    }
}
