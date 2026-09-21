using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

// Read-only endpoints for a user's completed workouts. Writing happens in ExerciseController.saveWorkout.

[Authorize]
[ApiController]
[Route("api/workouts")]
public class WorkoutsController : ControllerBase {

    private readonly AppDbContext _context;

    public WorkoutsController(AppDbContext context){
        _context = context;
    }

    // GET api/workouts/getHistory?pastWorkoutQuantity=6&offset=0
    // Paginated summary list for the home screen and history page. Returns one row per workout with
    // muscle groups and their set counts, but not the individual sets. The client pages by passing
    // a growing offset; a response shorter than pastWorkoutQuantity tells it there's nothing more.
    [HttpGet("getHistory")]
    public async Task<IActionResult> GetHistory([FromQuery] int pastWorkoutQuantity, [FromQuery] int offset = 0)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // OrderByDescending must come before Skip/Take, otherwise "page 2" isn't stable between requests.
        // The two Include chains load entries -> exercise and entries -> sets in one query, so the
        // grouping below runs in memory without going back to the database.
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

        // Collapse each workout's entries by muscle group and sum the sets, e.g. two chest
        // exercises with 3 sets each become { MuscleGroup: "Chest", Sets: 6 }.
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

    // GET api/workouts/getWorkout/42
    // Full breakdown of a single workout for the history/[id] screen: every exercise with its
    // name, muscle group and each set's kg and reps. 404 if the id doesn't exist or isn't the caller's.
    [HttpGet("getWorkout/{id}")]
    public async Task<IActionResult> GetWorkout(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var workout = await _context.Workouts
            .Where(w => w.UserId == userId && w.Id == id)
            .Include(w => w.WorkoutEntries).ThenInclude(e => e.Exercise)
            .Include(w => w.WorkoutEntries).ThenInclude(e => e.Sets)
            .FirstOrDefaultAsync();

        if (workout == null) return NotFound();

        var result = new {
            workout.Id,
            workout.CreatedAt,
            workout.TotalKg,
            Exercises = workout.WorkoutEntries.Select(e => new {
                e.Exercise.Name,
                e.Exercise.MuscleGroup,
                Sets = e.Sets.Select(s => new { s.Kg, s.Reps }).ToList()
            }).ToList()
        };

        return Ok(result);
    }
}
