using FitnessApp.Model;
using Microsoft.AspNetCore.Mvc;
using EntityFrameworkCore.MySQL.Data;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.Repositories;

public class WorkoutRepository : IWorkoutRepository
{
    private readonly AppDbContext _context;

    public WorkoutRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddWorkoutAsync(Workout workout)
    {
        _context.Workouts.Add(workout);
        await _context.SaveChangesAsync();
    }

    public async Task AddSetAsync(int workoutId, Set set)
    {
        set.WorkoutId = workoutId;
        _context.Sets.Add(set);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateWorkoutAsync(Workout workout)
    {
        _context.Workouts.Update(workout);
        await _context.SaveChangesAsync();
    }

    public async Task<Workout> GetWorkoutAsync(int workoutId)
    {
        return await _context.Workouts.FindAsync(workoutId);
    }

    public async Task<List<Workout>> GetPreviousWorkoutsAsync(int userId)
    {
        return await _context.Workouts.Where(w => w.UserId == userId).OrderByDescending(w => w.StartDate).ToListAsync();
    }

    public async Task<Workout> GetWorkoutDetailsAsync(int workoutId)
    {
        var workout = await _context.Workouts
            .Include(w => w.Sets)
            .FirstOrDefaultAsync(w => w.Id == workoutId);

        if (workout != null)
        {
            return new Workout
            {
                Id = workout.Id,
                StartDate = workout.StartDate,
                Duration = workout.Duration,
                Sets = workout.Sets.ToList(),
                UserId = workout.UserId
            };
        }

        return null;
    }

}