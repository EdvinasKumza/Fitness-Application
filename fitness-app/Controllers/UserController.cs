using Microsoft.AspNetCore.Mvc;
using EntityFrameworkCore.MySQL.Data;
using Microsoft.EntityFrameworkCore;
using FitnessApp.Utils;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DotNetEnv;
namespace FitnessApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _appDbContext;

    public UserController(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] User user)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        bool emailExists = await _appDbContext.Users.AnyAsync(u => u.Email == user.Email);
        if (emailExists)
        {
            return Conflict("Email already exists");
        }

        user.Password = Utils.Utils.HashPassword(user.Password);

        _appDbContext.Users.Add(user);
        await _appDbContext.SaveChangesAsync();

        return Ok(user);
    }

    private readonly string jwtSecretKey = Environment.GetEnvironmentVariable("JWT_SECRET");

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginModel login)
    {
        Console.WriteLine("Login: " + login.Email);

        var user = _appDbContext.Users.FirstOrDefault(u => u.Email == login.Email);
        if (user == null || !Utils.Utils.VerifyPassword(login.Password, user.Password))
        {
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

        return Ok(new
        {
            Token = tokenString,
            Name = user.Name
        });
    }
    
}
