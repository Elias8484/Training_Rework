using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Backend.Models;

[Table("todos")] // Matches the SQL table name
public class Todo : BaseModel
{
    [PrimaryKey("id", false)] // false means the database generates the ID
    public int Id { get; set; }

    [Column("task")]
    public string Task { get; set; } = string.Empty;

    [Column("is_complete")]
    public bool IsComplete { get; set; }

    [Column("inserted_at")]
    public DateTime? InsertedAt { get; set; }
}