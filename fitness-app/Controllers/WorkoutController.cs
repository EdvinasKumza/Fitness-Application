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
    [Route("api/workouts/schedule")]
    public async Task<IActionResult> ScheduleWorkout([FromBody] ScheduleWorkoutRequest request)
    {
        var authorizationHeader = Request.Headers["Authorization"].ToString();
        var userId = Utils.Utils.verifyToken(authorizationHeader);
        var workout = await _appDbContext.Workouts.FindAsync(request.WorkoutId);
        if (workout == null || workout.UserId != userId)
        {
            return BadRequest("Invalid workout or user not authorized.");
        }

        var scheduledDate = request.ScheduledDate;

        scheduledDate = scheduledDate.ToLocalTime();

        var schedule = new Schedule
        {
            WorkoutId = request.WorkoutId,
            ScheduledDate = scheduledDate,
            Notes = request.Notes
        };

        _appDbContext.Schedules.Add(schedule);
        await _appDbContext.SaveChangesAsync();
        return Ok();
    }

    [HttpGet]
    [Route("api/workouts/schedule")]
    public async Task<IActionResult> GetScheduledWorkouts([FromHeader] string Authorization)
    {
        var userId = Utils.Utils.verifyToken(Authorization);

        if (userId == -1)
        {
            return Unauthorized("Invalid or missing JWT token");
        }

        var schedules = await _appDbContext.Schedules
            .Include(s => s.Workout)
            .Where(s => s.Workout.UserId == userId)
            .ToListAsync();
        var response = schedules.Select(s => new
        {
            id = s.Id,
            title = s.Workout.Name,
            start = s.ScheduledDate.ToString("yyyy-MM-ddTHH:mm:ss"),
            duration = s.Workout.Duration,
            notes = s.Notes
        });
        return Ok(response);
    }

    [HttpDelete]
    [Route("api/workouts/schedule/{id}")]
    public async Task<IActionResult> DeleteScheduledWorkout(int id, [FromHeader] string Authorization)
    {
        var userId = Utils.Utils.verifyToken(Authorization);

        if (userId == -1)
        {
            return Unauthorized("Invalid or missing JWT token");
        }

        var schedule = await _appDbContext.Schedules
            .Include(s => s.Workout)
            .FirstOrDefaultAsync(s => s.Id == id && s.Workout.UserId == userId);

        if (schedule == null)
        {
            return BadRequest("Invalid schedule or user not authorized.");
        }

        _appDbContext.Schedules.Remove(schedule);
        await _appDbContext.SaveChangesAsync();

        return Ok();
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

        var workout = await _appDbContext.Workouts.FindAsync(workoutId);
        if (workout == null)
        {
            return NotFound();
        }

        var workoutExerciseOrder = new WorkoutExerciseOrder
        {
            WorkoutId = workoutId,
            ExerciseId = exerciseId.ExerciseId,
            Order = await GetNextExerciseOrder(workoutId)
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

        if (user == null)
        {
            return NotFound();
        }

        var workouts = await _appDbContext.Workouts
            .Where(w => w.UserId == userId)
            .Include(w => w.Sets)
            .Include(w => w.WorkoutExerciseOrders)
                .ThenInclude(weo => weo.Exercise)
            .ToListAsync();

        if (workouts == null || !workouts.Any())
        {
            return NotFound("No workouts found for the user.");
        }

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