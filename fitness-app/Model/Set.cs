using FitnessApp.Model;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessApp.Model;

public class Set
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    [Required]
    public int Reps { get; set; }
    [Required]
    public int Weight { get; set; }
    [Required]
    public string Type { get; set; }
    [Required]
    public int RestTime { get; set; }
    [Required]
    public int Order { get; set; }
    [Required]
    public int WorkoutId { get; set; }
    public Workout Workout { get; set; }
    [Required]
    public int ExerciseId { get; set; }
    public Exercise Exercise { get; set; }
    public string? Notes { get; set; }
}
