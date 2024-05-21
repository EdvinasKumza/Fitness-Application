using FitnessApp.Model;
using FitnessApp.Services;
using Microsoft.AspNetCore.Mvc;
using EntityFrameworkCore.MySQL.Data;

namespace FitnessApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkoutController : ControllerBase
{
    private readonly IWorkoutService _workoutService;
    private readonly AppDbContext _appDbContext;

    public WorkoutController(IWorkoutService workoutService, AppDbContext appDbContext)
    {
        _workoutService = workoutService;
        _appDbContext = appDbContext;
    }

    [HttpPost]
    [Route("start")]
    public async Task<IActionResult> StartWorkout([FromBody] User user)
    {
        var tempUser = await _workoutService.GetUserAsync(user);
        var newWorkout = await _workoutService.StartWorkoutAsync(tempUser.Id);
        return Ok(newWorkout);
    }

    [HttpPost]
    [Route("{workoutId}/sets")]
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
    [Route("{workoutId}")]
    public async Task<IActionResult> EndWorkout(int workoutId)
    {
        await _workoutService.EndWorkoutAsync(workoutId);
        return Ok();
    }

    [HttpGet]
    [Route("workouts")]
    public async Task<IActionResult> GetPreviousWorkouts([FromBody] User user)
    {
        var tempUser = await _workoutService.GetUserAsync(user);
        var workouts = await _workoutService.GetPreviousWorkoutsAsync(tempUser.Id);
        tempUser.Workouts.AddRange(workouts);
        _appDbContext.Users.Update(tempUser);
        await _appDbContext.SaveChangesAsync();
        return Ok(workouts);
    }

    [HttpGet]
    [Route("{workoutId}")]
    public async Task<IActionResult> GetWorkout(int workoutId, [FromBody] User user)
    {
        var workout = await _workoutService.GetWorkoutAsync(workoutId);
        if (workout == null)
        {
            return NotFound();
        }
        return Ok(workout);
    }
}