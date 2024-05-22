using FitnessApp.Model;
using FitnessApp.Services;
using Microsoft.AspNetCore.Mvc;
using EntityFrameworkCore.MySQL.Data;
using System.Threading.Tasks;

namespace FitnessApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExerciseController : ControllerBase
{
    private readonly AppDbContext _appDbContext;

    public ExerciseController(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }

    /*[HttpPost]
    [Route("")]
    public async Task<IActionResult> AddSet(int workoutId, [FromBody] Set set)
    {
        
    }*/

    [HttpGet]
    [Route("getexercises")]
    public IActionResult GetExercises()
    {
        var exercises = _appDbContext.Exercises.ToList();
        return Ok(exercises);
    }
}