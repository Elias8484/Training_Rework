using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/exercises")]
public class ExerciseController : ControllerBase
{
    private readonly AppDbContext _context;

    public ExerciseController(AppDbContext context)
    {
        _context = context;
    }

    /*

    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok("deploy works!!!");
    }

    [HttpGet]
    public async Task<IActionResult> GetTodos()
    {
        var todos = await _context.Todos.ToListAsync();
        return Ok(todos);
    }

    */

    [HttpPost("createNewExercise")]
    public async Task<IActionResult> CreateExercise([FromBody] Exercise newExercise)
    {
        try
    // create exercise object from exercise Model with the json body data send from frontend
        {
            var exercise = new Exercise {
                Name = newExercise.Name,
                UserId = newExercise.UserId,
                MuscleGroup = newExercise.MuscleGroup,
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