using FitnessApp.Model;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class Schedule
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public int WorkoutId { get; set; }

    public Workout Workout { get; set; }

    [Required]
    public DateTime ScheduledDate { get; set; }

    public string? Notes { get; set; }
}