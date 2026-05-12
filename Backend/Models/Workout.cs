using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("workouts")]
public class Workout
{
    [Key]
    [Column("workout_id")]
    public long Id { get; set; }

    [ForeignKey("User")]
    [Column("user_id")]
    public long UserId { get; set; }

    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("created_at")]
    public DateTime? CreatedAt { get; set; }

    [Column("total_exercises")]
    public int TotalExercises { get; set; }

    [Column("total_sets")]
    public int TotalSets { get; set; }

    [Column("total_kg")]
    public double TotalKg { get; set; }


}