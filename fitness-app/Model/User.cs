using System;
using System.ComponentModel.DataAnnotations;

namespace FitnessApp.Model;

public class User
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public string Email { get; set; }
    [Required]
    public string Password { get; set; }
    [Required]
    public int Age {get; set; }
    public List<Workout>? Workouts { get; set; }
} 
