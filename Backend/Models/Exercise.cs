using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("exercises")]
public class Exercise
{
    [Key]
    [Column("exercise_id")]
    public long Id { get; set; }

    [ForeignKey("User")]
    [Column("user_id")]
    public long UserId { get; set; }

    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("muscle_group")]
    public string MuscleGroup { get; set; }

    [Column("created_at")]
    public DateTime? CreatedAt { get; set; }
}