using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/history")]
public class WorkoutHistoryController : ControllerBase {

    private readonly AppDbContext _context;

    public WorkoutHistoryController(AppDbContext context){
        _context = context;
    }

    [AllowAnonymous]
    [HttpGet("getHistory")]
    public async Task<IActionResult> GetHistory()
    {
        var userId = 1; // int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var workouts = await _context.Workouts
            .Where(w => w.UserId == userId)
            .Include(w => w.WorkoutEntries)
                .ThenInclude(e => e.Exercise)
            .Include(w => w.WorkoutEntries)
                .ThenInclude(e => e.Sets)
            .ToListAsync();

        var result = workouts.Select(w => new {
            w.Id,
            w.CreatedAt,
            w.TotalKg,
            MuscleGroups = w.WorkoutEntries
                .GroupBy(e => e.Exercise.MuscleGroup)
                .Select(g => new { MuscleGroup = g.Key, Sets = g.Sum(e => e.Sets.Count) })
                .ToList()
        });

        return Ok(result);
    }


}