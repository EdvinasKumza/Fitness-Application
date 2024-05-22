using FitnessApp.Model;
using Microsoft.AspNetCore.Mvc;
using EntityFrameworkCore.MySQL.Data;
using Microsoft.EntityFrameworkCore;
using FitnessApp.Utils;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DotNetEnv;

namespace FitnessApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        private readonly ICustomLogger _logger;

        public UserController(AppDbContext appDbContext, ICustomLogger logger)
        {
            _appDbContext = appDbContext;
            _logger = logger;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] User user)
        {
            var permissions = string.Join(",", HttpContext.User.Claims
                                                .Where(c => c.Type == ClaimTypes.Role)
                                                .Select(c => c.Value));

            _logger.Log("System", permissions, "Signup", nameof(UserController), $"Attempting to sign up user '{user.Email}'.");

            if (!ModelState.IsValid)
            {
                _logger.Log("System", permissions, "Signup", nameof(UserController), $"Invalid model state for user '{user.Email}'.");
                return BadRequest(ModelState);
            }

            bool emailExists = await _appDbContext.Users.AnyAsync(u => u.Email == user.Email);
            if (emailExists)
            {
                _logger.Log("System", permissions, "Signup", nameof(UserController), $"User signup failed for email '{user.Email}'. Email already exists.");
                return Conflict("Email already exists");
            }

            user.Password = Utils.Utils.HashPassword(user.Password);

            _appDbContext.Users.Add(user);
            await _appDbContext.SaveChangesAsync();

            _logger.Log("System", permissions, "Signup", nameof(UserController), $"User '{user.Email}' signed up successfully.");

            return Ok(user);
        }

        private readonly string jwtSecretKey = Environment.GetEnvironmentVariable("JWT_SECRET");

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel login)
        {
            Console.WriteLine("Login: " + login.Email);
            _logger.Log("System", "Info", "Login", nameof(UserController), $"Attempting login for email '{login.Email}'.");

            var user = _appDbContext.Users.FirstOrDefault(u => u.Email == login.Email);
            if (user == null || !Utils.Utils.VerifyPassword(login.Password, user.Password))
            {
                _logger.Log("System", "Unauthorized", "Login", nameof(UserController), $"Login failed for email '{login.Email}'. Invalid credentials.");
                return Unauthorized("Invalid credentials");
            }

            // Create JWT token
            var claims = new[] {
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "localhost:5260",
                audience: "localhost:5260",
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            _logger.Log("System", "Success", "Login", nameof(UserController), $"User '{user.Email}' logged in successfully.");

            return Ok(new
            {
                Token = tokenString,
                Name = user.Name
            });
        }
    }
}
