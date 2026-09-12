using Microsoft.AspNetCore.Mvc;
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

    [HttpGet("getHistory")]
    public async Task<IActionResult> GetHistory([FromQuery] int pastWorkoutQuantity, [FromQuery] int offset = 0)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var workouts = await _context.Workouts
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.CreatedAt)
            .Skip(offset)
            .Take(pastWorkoutQuantity)
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

    [HttpGet("getDetails/{id}")]
    public async Task<IActionResult> GetDetails(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var workout = await _context.Workouts
            .Where(w => w.UserId == userId && w.Id == id)
            .Include(w => w.WorkoutEntries).ThenInclude(e => e.Exercise)
            .Include(w => w.WorkoutEntries).ThenInclude(e => e.Sets)
            .FirstOrDefaultAsync();

        if (workout == null) return NotFound();
        
        
        var result = ( new {
            workout.Id,
            workout.CreatedAt,
            workout.TotalKg,
            Exercises = workout.WorkoutEntries.Select(e => new {
                e.Exercise.Name,
                e.Exercise.MuscleGroup,
                Sets = e.Sets.Select(s => new { s.Kg, s.Reps }).ToList()
            }).ToList()
        });

        return Ok(result);
    }


}