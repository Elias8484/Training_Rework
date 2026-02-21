using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CounterController : ControllerBase
{
    private readonly CounterState _state;

    public CounterController(CounterState state)
    {
        _state = state;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { value = _state.Value });
    }

    [HttpPost("increment")]
    public IActionResult Increment()
    {
        var newValue = _state.Increment();
        return Ok(new { value = newValue });
    }
}
