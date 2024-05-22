using System.ComponentModel.DataAnnotations;

namespace FitnessApp.Model;

public class Goal 
{
    [Key]
    public int Id { get; set; }
    [Required]
    public int UserId { get; set; }
    [Required]
    public string Type { get; set; }
    [Required]
    public int Target { get; set; }
}