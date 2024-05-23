using FitnessApp.Model;
using FitnessApp.Services;
using Microsoft.AspNetCore.Mvc;
using EntityFrameworkCore.MySQL.Data;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.Controllers;

public class SetsController : ControllerBase
{
    private readonly AppDbContext _appDbContext;

    public SetsController(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }

    [HttpGet("api/sets")]
    public async Task<IActionResult> GetSets([FromHeader] string Authorization)
    {
        var jwtToken = Authorization.Split(" ")[1];
        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(jwtToken);
        var userId = -1;
        var claims = token.Claims.Select(claim => (claim.Type, claim.Value)).ToList();
        userId = int.Parse(claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

        var sets = await _appDbContext.Sets.Where(s => s.Workout.UserId == userId).ToListAsync();

        return Ok(sets);
    }
}