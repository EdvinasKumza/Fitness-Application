using System;
using System.ComponentModel.DataAnnotations;

namespace FitnessApp.Model;

public class LoginModel
{
    [Required]
    public string Email { get; set; }
    [Required]
    public string Password { get; set; }
}
