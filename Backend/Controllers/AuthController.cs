using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using BCrypt.Net;

namespace Backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly Supabase.Client _supabase;

    public AuthController(Supabase.Client supabase)
    {
        _supabase = supabase;
    }

    public record RegisterRequest(string FullName, string Username, string Password);
    public record LoginRequest(string Username, string Password);

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        // Check if username is taken
        var existing = await _supabase.From<User>()
            .Where(u => u.Username == req.Username)
            .Single();

        if (existing != null)
            return Conflict("Username already taken.");

        var user = new User
        {
            FullName = req.FullName,
            Username = req.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            CreatedAt = DateTime.UtcNow,
        };

        var result = await _supabase.From<User>().Insert(user);
        var created = result.Models.First();

        return Ok(new { created.Id, created.FullName, created.Username, created.CreatedAt });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var user = await _supabase.From<User>()
            .Where(u => u.Username == req.Username)
            .Single();

        if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized("Invalid username or password.");

        return Ok(new { user.Id, user.FullName, user.Username, user.CreatedAt });
    }
}
