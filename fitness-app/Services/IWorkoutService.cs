using FitnessApp.Model;
using FitnessApp.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FitnessApp.Services;
public interface IWorkoutService
{
    Task<Workout> StartWorkoutAsync(int userId);
    Task AddSetAsync(int workoutId, Set set);
    Task EndWorkoutAsync(int workoutId);
    Task<List<Workout>> GetPreviousWorkoutsAsync(int userId);
    Task<Workout> GetWorkoutAsync(int workoutId);
}