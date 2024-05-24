using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace FitnessApp.Model
{
    public class WorkoutExerciseOrder
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public int WorkoutId { get; set; }
        [Required]
        public Workout Workout { get; set; }
        [Required]
        public int ExerciseId { get; set; }
        [Required]
        public int Order { get; set; }
    }
}
