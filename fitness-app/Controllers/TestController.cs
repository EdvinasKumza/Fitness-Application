using Microsoft.AspNetCore.Mvc;

namespace FitnessApp.Controllers;

[ApiController]
[Route("[controller]")]
public class TestController : ControllerBase
{
    [HttpGet("/api/test")]
    public IActionResult GetTestData()
    {
        Console.WriteLine("Request");
        return Ok(new { message = "Yep" });
    }
}
