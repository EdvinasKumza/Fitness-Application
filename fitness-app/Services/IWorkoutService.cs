using FitnessApp.Model;
using FitnessApp.Repositories;

namespace FitnessApp.Services;
public interface IWorkoutService
{
    Task<Workout> StartWorkoutAsync();
    Task AddSetAsync(int workoutId, Set set);
    Task EndWorkoutAsync(int workoutId);
    Task<List<Workout>> GetPreviousWorkoutsAsync();
    Task<Workout> GetWorkoutAsync(int workoutId);
}