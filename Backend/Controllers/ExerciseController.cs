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
    public record SetRequest(decimal Kg, int reps);
    public record ExerciseRequest(string ExerciseId, List<SetRequest> Sets);
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
        var exercises = await _context.Exercises.Where(e => e.UserId == userId)
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
        try{
             return Ok("saveworkout sucess" + req.Exercises[0].ExerciseId);
        }

        catch (Exception ex)
        {
            Console.WriteLine($"Insert Error: {ex.Message}");
            return BadRequest(ex.Message);
        }
    }
    // deploy test
  /*  [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodo(int id)
    {
        try
        {
            var todo = await _context.Todos.FindAsync(id);
            if (todo == null) return NotFound();
            _context.Todos.Remove(todo);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Delete Error: {ex.Message}");
            return BadRequest(ex.Message);
        }
    }

    */
}