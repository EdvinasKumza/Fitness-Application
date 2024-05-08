using FitnessApp.Model;

namespace FitnessApp.Repositories;
public interface IWorkoutRepository
{
    Task AddWorkoutAsync(Workout workout);
    Task AddSetAsync(int workoutId, Set set);
    Task UpdateWorkoutAsync(Workout workout);
    Task<Workout> GetWorkoutAsync(int workoutId);
    Task<List<Workout>> GetPreviousWorkoutsAsync();
    Task<Workout> GetWorkoutDetailsAsync(int workoutId);
}