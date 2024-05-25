using FitnessApp.Model;
using FitnessApp.Services;
using Microsoft.AspNetCore.Mvc;
using EntityFrameworkCore.MySQL.Data;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.Net;
using FitnessApp.Utils;

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
        var userId = Utils.Utils.verifyToken(Authorization);

        var sets = await _appDbContext.Sets.Where(s => s.Workout.UserId == userId).ToListAsync();

        return Ok(sets);
    }

    [HttpPost("api/sets/{setId}/complete")]
    public async Task<IActionResult> CompleteSet(int setId, [FromBody] Set set)
    {
        if (set == null)
        {
            return BadRequest();
        }

        var existingSet = await _appDbContext.Sets.FindAsync(setId);
        if (existingSet == null)
        {
            return NotFound();
        }

        existingSet.Completed = !existingSet.Completed;
        await _appDbContext.SaveChangesAsync();

        return Ok(existingSet);
    }

    [HttpPost("api/sets/add")]
    public async Task<IActionResult> AddSet([FromBody] Set set)
    {
        Console.WriteLine(set);
        if (set == null)
        {
            return BadRequest();
        }

        _appDbContext.Sets.Add(set);
        await _appDbContext.SaveChangesAsync();

        return Ok(set);
    }
    [HttpDelete("api/sets/{setId}")]
    public async Task<IActionResult> DeleteSet(int setId)
    {
        Console.WriteLine(setId);
        var existingSet = await _appDbContext.Sets.FindAsync(setId);
        if (existingSet == null)
        {
            return NotFound();
        } 

        _appDbContext.Remove(existingSet);
        await _appDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpPut("api/sets/{setId}")]
    public async Task<IActionResult> UpdateSet(int setId, [FromBody] Set updatedSet)
    {
        var existingSet = await _appDbContext.Sets.FindAsync(setId);
        if (existingSet == null)
        {
            return NotFound();
        }

        existingSet.Reps = updatedSet.Reps;
        existingSet.Weight = updatedSet.Weight;
        // Add any other fields that need updating

        await _appDbContext.SaveChangesAsync();

        return Ok(existingSet);
    }




}