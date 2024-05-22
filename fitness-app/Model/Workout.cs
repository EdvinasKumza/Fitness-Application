using FitnessApp.Model;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessApp.Model;

public class Workout
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    [Required]
    public int UserId { get; set; }
    [Required]
    public string Name { get; set; }
    public List<Set>? Sets { get; set; }
    [Required]
    public DateTime StartDate { get; set; }
    [Required]
    public int Duration { get; set; }
    [Required]
    public string Type { get; set; }
    public string? Description { get; set; }
    public string? Notes { get; set; }
}
