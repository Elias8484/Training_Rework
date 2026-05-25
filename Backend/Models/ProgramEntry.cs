using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("program_entries")]
public class ProgramEntry
{
    [Key]
    [Column("program_entry_id")]
    public long Id { get; set; }

    [ForeignKey("Program")]
    [Column("program_id")]
    public long ProgramId { get; set; }

    [ForeignKey("Exercise")]
    [Column("exercise_id")]
    public long ExerciseId { get; set; }
}