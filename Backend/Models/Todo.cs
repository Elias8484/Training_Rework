using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("todos")]
public class Todo
{
    [Key]
    public int Id { get; set; }

    [Column("task")]
    public string Task { get; set; } = string.Empty;

    [Column("is_complete")]
    public bool IsComplete { get; set; }

    [Column("inserted_at")]
    public DateTime? InsertedAt { get; set; }
}