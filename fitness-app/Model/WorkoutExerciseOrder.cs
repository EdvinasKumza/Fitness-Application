using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FitnessApp.Model
{
    public class WorkoutExerciseOrder
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public int WorkoutId { get; set; }
        [JsonIgnore]
        public Workout Workout { get; set; }
        [Required]
        public int ExerciseId { get; set; }
        public Exercise Exercise { get; set; }
        [Required]
        public int Order { get; set; }
    }
}
