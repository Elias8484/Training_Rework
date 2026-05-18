using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/exercises")]
public class ExerciseController : ControllerBase
{
    private readonly AppDbContext _context;

    public record CreateExerciseRequest(string Name, string MuscleGroup);

    // Nested saveworkout request with the 3 records below
    public record SetRequest(double Kg, int Reps);
    public record ExerciseRequest(long ExerciseId, List<SetRequest> Sets);
    public record SaveWorkoutRequest(string Name, List<ExerciseRequest> Exercises);

    public ExerciseController(AppDbContext context)
    {
        _context = context;
    }

    // Assemble a list with all the exercises from the database save to the logged in user
    [HttpGet("getExercises")]
    public async Task<IActionResult> GetExercises()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var exercises = await _context.Exercises.Where(e => e.UserId == userId && !e.IsDeleted)
                                                .Select(e => new { e.Id, e.Name, e.MuscleGroup })
                                                .ToListAsync();
        return Ok(exercises);
    }

    [HttpPost("createNewExercise")]
    public async Task<IActionResult> CreateExercise([FromBody] CreateExerciseRequest req)
    {
        // create exercise object from exercise Model with the json body data send from frontend
        try{
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var exercise = new Exercise {
                Name = req.Name,
                UserId = userId,
                MuscleGroup = req.MuscleGroup,
                CreatedAt = DateTime.UtcNow,
            };
        // and a save the exercise object to the DB exercises table
            _context.Exercises.Add(exercise);
            await _context.SaveChangesAsync();
            return Ok(exercise);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Insert Error: {ex.Message}");
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("saveWorkout")]
    public async Task<IActionResult> SaveWorkout([FromBody] SaveWorkoutRequest req)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        
        int workoutTotalExercises = 0;
        int workoutTotalSets = 0;
        int workoutTotalReps = 0;
        double workoutTotalKg = 0;


        try{
            var workout = new Workout {
                UserId = userId,
                Name = "placeholder",
                CreatedAt = DateTime.UtcNow,
                TotalExercises = 0,
                TotalSets = 0,
                TotalKg = 0.0
            };
            // Save workout instantly to DB so it gets an id that is needed for workoutEntry
            _context.Workouts.Add(workout);
            await _context.SaveChangesAsync();

            foreach (var exercise in req.Exercises){
                var workoutEntry = new WorkoutEntry {
                    WorkoutId = workout.Id,
                    ExerciseId = exercise.ExerciseId,
                };
                 // Skip exercise if it does not contain any sets where kg or reps have an entered amount
                 var validSets = exercise.Sets.Where(s => s.Kg != 0 || s.Reps != 0).ToList();
                 if (validSets.Count == 0) continue;

                workoutTotalExercises++;

                _context.WorkoutEntries.Add(workoutEntry);
                await _context.SaveChangesAsync();

                foreach(var set in exercise.Sets) {
                    // skip if empty set
                    if (set.Kg == 0 || set.Reps == 0) continue;

                    var createdSet = new Set {
                       WorkoutEntryId = workoutEntry.Id,
                       Kg = set.Kg,
                       Reps = set.Reps 
                    };

                    workoutTotalKg += set.Kg * set.Reps;
                    workoutTotalReps += set.Reps;
                    workoutTotalSets++;
                    _context.Sets.Add(createdSet);
                }
            }

            workout.TotalReps = workoutTotalReps;
            workout.TotalExercises = workoutTotalExercises;
            workout.TotalSets = workoutTotalSets;
            workout.TotalKg = workoutTotalKg;

            await _context.SaveChangesAsync();

            return Ok("saveworkout sucess");
        }

        catch (Exception ex)
        {
            Console.WriteLine($"Insert Error: {ex.Message}");
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("deleteExercise/{exerciseId}")]
    public async Task<IActionResult> DeleteExercise(long exerciseId) {
        Console.WriteLine($"Deleting exercise id: {exerciseId}");
        try{
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // Delete exercise that match the userId and exercise id from the request
            var exercise = await _context.Exercises.FirstOrDefaultAsync(e => e.Id == exerciseId && e.UserId == userId);

            if (exercise == null) return NotFound();

            exercise.IsDeleted = true;

            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Insert Error: {ex.Message}");
            return BadRequest(ex.Message);  
        }
    }

    [HttpGet("getLastExerciseData/{exerciseId}")]
    public async Task<IActionResult> GetLastSetsData(long exerciseId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        
        var sets = await _context.Sets
            .FromSqlRaw(@"
                WITH last_entry AS (
                    SELECT we.workout_entry_id
                    FROM workout_entries we
                    JOIN workouts w ON we.workout_id = w.workout_id
                    WHERE we.exercise_id = {0}
                    AND w.user_id = {1}
                    ORDER BY w.created_at DESC
                    LIMIT 1
                )
                SELECT s.set_id, s.workout_entry_id, s.kg, s.reps
                FROM sets s
                JOIN last_entry le ON s.workout_entry_id = le.workout_entry_id
                ORDER BY s.set_id ASC
            ", exerciseId, userId)
            .ToListAsync();

        if (sets.Count == 0) return Ok(new { sets = new List<object>() });


        return Ok(new { sets = sets.Select(s => new { s.Kg, s.Reps }) });
    }
   
}