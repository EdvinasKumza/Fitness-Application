using FitnessApp.Model;
using FitnessApp.Services;
using Microsoft.AspNetCore.Mvc;
using EntityFrameworkCore.MySQL.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Web;
using Microsoft.AspNetCore.Authentication;

namespace FitnessApp.Controllers;

public class WorkoutsController : ControllerBase
{
    private readonly IWorkoutService _workoutService;
    private readonly AppDbContext _appDbContext;

    public WorkoutsController(IWorkoutService workoutService, AppDbContext appDbContext)
    {
        _workoutService = workoutService;
        _appDbContext = appDbContext;
    }

    [HttpPost]
    [Route("api/workouts/start")]
    public async Task<IActionResult> StartWorkout([FromHeader] string Authorization)
    {
        var jwtToken = Authorization.Split(" ")[1];
        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(jwtToken);
        var userId = -1;
        var claims = token.Claims.Select(claim => (claim.Type, claim.Value)).ToList();
        userId = int.Parse(claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

        Console.WriteLine("userid" + userId);

        if (userId == -1)
        {
            return BadRequest("Invalid or missing JWT token");
        }

        var newWorkout = await _workoutService.StartWorkoutAsync(userId);
        return Ok(newWorkout);
    }

    [HttpPost]
    [Route("api/workouts/{workoutId}/sets")]
    public async Task<IActionResult> AddSet(int workoutId, [FromBody] Set set)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        await _workoutService.AddSetAsync(workoutId, set);
        return Ok();
    }

    [HttpPut]
    [Route("api/workouts/{workoutId}")]
    public async Task<IActionResult> EndWorkout(int workoutId)
    {
        await _workoutService.EndWorkoutAsync(workoutId);
        return Ok();
    }

    [HttpGet]
    [Route("api/workouts")]
    public async Task<IActionResult> GetPreviousWorkouts([FromHeader] string Authorization)
    {
        var jwtToken = Authorization.Split(" ")[1];
        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(jwtToken);
        var userId = -1;
        var claims = token.Claims.Select(claim => (claim.Type, claim.Value)).ToList();
        userId = int.Parse(claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

        if (userId == -1)
        {
            return BadRequest("Invalid or missing JWT token");
        }

        var user = await _appDbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);

        var workouts = await _workoutService.GetPreviousWorkoutsAsync(userId);
        if(workouts == null)
        {
            return NotFound();
        }
        user.Workouts = workouts;
        _appDbContext.Users.Update(user);
        await _appDbContext.SaveChangesAsync();
        return Ok(workouts);
    }

    [HttpGet]
    [Route("api/workouts/{workoutId}")]
    public async Task<IActionResult> GetWorkout(int workoutId)
    {
        var workout = await _workoutService.GetWorkoutAsync(workoutId);
        if (workout == null)
        {
            return NotFound();
        }
        return Ok(workout);
    }
}