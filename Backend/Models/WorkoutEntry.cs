using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("workout_entries")]
public class WorkoutEntry
{
    [Key]
    [Column("workout_entry_id")]
    public long Id { get; set; }

    [ForeignKey("Workout")]
    [Column("workout_id")]
    public long WorkoutId { get; set; }

    [ForeignKey("Exercise")]
    [Column("exercise_id")]
    public long ExerciseId { get; set; }
}