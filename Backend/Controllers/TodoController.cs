using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/todo")]
public class TodoController : ControllerBase
{
    private readonly AppDbContext _context;

    public TodoController(AppDbContext context)
    {
        _context = context;
    }

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

    [HttpPost]
    public async Task<IActionResult> CreateTodo([FromBody] Todo newTodo)
    {
        try
        {
            _context.Todos.Add(newTodo);
            await _context.SaveChangesAsync();
            return Ok(newTodo);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Insert Error: {ex.Message}");
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
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
}