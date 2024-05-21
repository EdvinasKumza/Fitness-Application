using FitnessApp.Model;
using System.Threading.Tasks;

namespace FitnessApp.Repositories;
public interface IWorkoutRepository
{
    Task AddWorkoutAsync(Workout workout);
    Task AddSetAsync(int workoutId, Set set);
    Task UpdateWorkoutAsync(Workout workout);
    Task<Workout> GetWorkoutAsync(int workoutId);
    Task<List<Workout>> GetPreviousWorkoutsAsync(int userId);
    Task<Workout> GetWorkoutDetailsAsync(int workoutId);
    Task<User> GetUserAsync(User user);
}