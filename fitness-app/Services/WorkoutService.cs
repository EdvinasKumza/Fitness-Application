using FitnessApp.Model;
using FitnessApp.Repositories;

namespace FitnessApp.Services;
public class WorkoutService : IWorkoutService
{
    private readonly IWorkoutRepository _workoutRepository;

    public WorkoutService(IWorkoutRepository workoutRepository)
    {
        _workoutRepository = workoutRepository;
    }

    public async Task<Workout> StartWorkoutAsync(int userId)
    {
        //TODO: Make the name automatically set to WorkoutINDEX
        var newWorkout = new Workout { StartDate = DateTime.UtcNow, Name = "New Workout", Duration = 0, Type = "Custom", UserId = userId  };

        await _workoutRepository.AddWorkoutAsync(newWorkout);
        return newWorkout;
    }

    public async Task AddSetAsync(int workoutId, Set set)
    {
        await _workoutRepository.AddSetAsync(workoutId, set);
    }

    public async Task EndWorkoutAsync(int workoutId)
    {
        var workout = await _workoutRepository.GetWorkoutAsync(workoutId);
        if (workout != null)
        {
            TimeSpan timeSpan = DateTime.UtcNow - workout.StartDate;
            workout.Duration = (int) timeSpan.TotalMinutes;
            await _workoutRepository.UpdateWorkoutAsync(workout);
        }
    }

    public async Task<List<Workout>> GetPreviousWorkoutsAsync(int userId)
    {
        return await _workoutRepository.GetPreviousWorkoutsAsync(userId);
    }

    public async Task<Workout> GetWorkoutAsync(int workoutId)
    {
        var workout = await _workoutRepository.GetWorkoutDetailsAsync(workoutId);
        return workout;
    }

    public async Task<User> GetUserAsync(User user)
    {
        return await _workoutRepository.GetUserAsync(user);
    }
}