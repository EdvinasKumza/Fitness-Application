using EntityFrameworkCore.MySQL.Data;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FitnessApp.Model;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.Controllers;

public class GoalsController : ControllerBase
{
    private readonly AppDbContext _appDbContext;

    public GoalsController(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }

    [HttpPost("api/goals/set")]
    public async Task<IActionResult> SetGoal([FromHeader] string Authorization, [FromBody] Goal goal)
    {
        var jwtToken = Authorization.Split(" ")[1];
        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(jwtToken);
        var userId = -1;
        var claims = token.Claims.Select(claim => (claim.Type, claim.Value)).ToList();
        userId = int.Parse(claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        goal.UserId = userId;

        var existingGoal = await _appDbContext.Goals.FirstOrDefaultAsync(g => g.UserId == userId && g.Type == goal.Type);
        if (existingGoal != null)
        {
            existingGoal.Target = goal.Target;
            await _appDbContext.SaveChangesAsync();
            return Ok(existingGoal);
        }

        _appDbContext.Goals.Add(goal);
        await _appDbContext.SaveChangesAsync();

        return Ok(goal);
    }

    [HttpGet("api/goals")]
    public async Task<IActionResult> GetGoals([FromHeader] string Authorization)
    {
        var jwtToken = Authorization.Split(" ")[1];
        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(jwtToken);
        var userId = -1;
        var claims = token.Claims.Select(claim => (claim.Type, claim.Value)).ToList();
        userId = int.Parse(claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

        var goals = await _appDbContext.Goals.Where(g => g.UserId == userId).ToListAsync();
        return Ok(goals);
    }

    [HttpDelete("api/goals/{goalId}")]
    public async Task<IActionResult> DeleteGoal(int goalId)
    {
        var goal = await _appDbContext.Goals.FindAsync(goalId);
        if (goal == null)
        {
            return NotFound();
        }

        _appDbContext.Goals.Remove(goal);
        await _appDbContext.SaveChangesAsync();

        return Ok();
    }

}