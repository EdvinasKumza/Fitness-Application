using Microsoft.AspNetCore.Mvc;
using EntityFrameworkCore.MySQL.Data;
using Microsoft.EntityFrameworkCore;
using FitnessApp.Utils;
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

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginModel login)
    {
        //print to console
        Console.WriteLine("Login: " + login.Email);
        // Fetch user from the database by email
        var user = _appDbContext.Users.FirstOrDefault(u => u.Email == login.Email);
        if (user == null || !Utils.Utils.VerifyPassword(login.Password, user.Password))
        {
            // Return Unauthorized if the user isn't found or the password is incorrect
            return Unauthorized("Invalid credentials");
        }

        HttpContext.Session.SetInt32("UserID", user.Id);

        return Ok(new {
            Message = "Login successful",
            UserId = user.Id,
            Name = user.Name,
            Email = user.Email
        });
    }

    [HttpGet("me")]
    public IActionResult GetCurrentUser()
    {
        Console.WriteLine("Get Current User");
        // Get the user ID from session
        var userId = HttpContext.Session.GetInt32("UserID");
        if (userId == null)
        {
            return Unauthorized("User not logged in");
        }

        // Find the user in the database
        var user = _appDbContext.Users.FirstOrDefault(u => u.Id == userId);
        if (user == null)
        {
            return NotFound("User not found");
        }

        // Return the user data (excluding sensitive information)
        return Ok(new
        {
            user.Id,
            user.Name,
            user.Email
        });
    }
    
}
