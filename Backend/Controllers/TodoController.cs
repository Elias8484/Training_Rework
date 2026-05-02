using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Supabase;

[ApiController]
[Route("api/todo")]
public class TodoController : ControllerBase
{
    private readonly Supabase.Client _supabase;

    public TodoController(Supabase.Client supabase)
    {
        _supabase = supabase;
    }

    // --- GET ALL TODOS123test ---
    [HttpGet]
    public async Task<IActionResult> GetTodos()
    {
        // Fetches all rows from the 'todos' table
        var result = await _supabase.From<Todo>().Get();
        return Ok(result.Models);
    }

    // --- CREATE TODO ---
    [HttpPost]
    public async Task<IActionResult> CreateTodo([FromBody] Todo newTodo)
    {
        try 
        {
            var result = await _supabase.From<Todo>().Insert(newTodo);
            return Ok(result.Models.FirstOrDefault());
        }
        catch (Exception ex)
        {
            // This will print the REAL error in your C# terminal
            Console.WriteLine($"Supabase Insert Error: {ex.Message}");
            return BadRequest(ex.Message);
        }
    }

    // --- DELETE TODO ---
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodo(int id)
    {
       try
        {
            await _supabase.From<Todo>().Where(x => x.Id == id).Delete();
            return NoContent();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Supabase Delete Error: {ex.Message}");
            return BadRequest(ex.Message);
        }
    }
}