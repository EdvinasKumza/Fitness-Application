using FitnessApp.Model;
using FitnessApp.Services;
using Microsoft.AspNetCore.Mvc;
using EntityFrameworkCore.MySQL.Data;
using System.Threading.Tasks;

namespace FitnessApp.Controllers;

public class ExerciseController : ControllerBase
{
    private readonly AppDbContext _appDbContext;

    public ExerciseController(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }

    [HttpGet]
    [Route("api/exercises")]
    public IActionResult GetExercises()
    {
        var exercises = _appDbContext.Exercises.ToList();
        return Ok(exercises);
    }
}