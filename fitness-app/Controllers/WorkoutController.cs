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
using FitnessApp.Utils;

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
        var userId = Utils.Utils.verifyToken(Authorization);

        if (userId == -1)
        {
            return BadRequest("Invalid or missing JWT token");
        }

        var newWorkout = await _workoutService.StartWorkoutAsync(userId);
        return Ok(newWorkout);
    }

    [HttpPost]
    [Route("api/workouts/{workoutId}/exercises")]
    public async Task<IActionResult> AddExercise(int workoutId, [FromBody] AddExerciseRequest exerciseId)
    {

        Console.WriteLine(exerciseId.ExerciseId);
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // 1. Find the workout
        var workout = await _appDbContext.Workouts.FindAsync(workoutId);
        if (workout == null)
        {
            return NotFound();
        }

        // 2. Create a new WorkoutExerciseOrder object
        var workoutExerciseOrder = new WorkoutExerciseOrder
        {
            WorkoutId = workoutId,
            ExerciseId = exerciseId.ExerciseId, // Assuming 'exercise' object has an 'Id' property
            Order = await GetNextExerciseOrder(workoutId) // Get the next order for this workout
        };

        // 4. Save the workout and WorkoutExerciseOrder
        await _appDbContext.WorkoutExerciseOrders.AddAsync(workoutExerciseOrder);
        await _appDbContext.SaveChangesAsync();

        return Ok();
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
        var userId = Utils.Utils.verifyToken(Authorization);

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

    private async Task<int> GetNextExerciseOrder(int workoutId)
    {
        // Get the maximum order for existing exercises in the workout
        var maxOrder = await _appDbContext.WorkoutExerciseOrders
            .Where(woeo => woeo.WorkoutId == workoutId)
            .MaxAsync(woeo => (int?)woeo.Order) + 1;

        // Return 1 if no exercises exist, otherwise return the next order
        return maxOrder ?? 1;
    }
}
public class AddExerciseRequest
{
    public int ExerciseId { get; set; }
}