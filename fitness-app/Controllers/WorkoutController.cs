using FitnessApp.Model;
using FitnessApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace FitnessApp.Controllers;

public class WorkoutController : ControllerBase
{
    private readonly IWorkoutService _workoutService;

    public WorkoutController(IWorkoutService workoutService)
    {
        _workoutService = workoutService;
    }

    [HttpPost]
    [Route("api/workouts/start")]
    public async Task<IActionResult> StartWorkout()
    {
        var newWorkout = await _workoutService.StartWorkoutAsync();
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
    public async Task<IActionResult> GetPreviousWorkouts()
    {
        var workouts = await _workoutService.GetPreviousWorkoutsAsync();
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