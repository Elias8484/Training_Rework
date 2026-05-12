using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("sets")]
public class Set
{
    [Key]
    [Column("set_id")]
    public long Id { get; set; }

    [ForeignKey("WorkoutEntry")]
    [Column("workout_entry_id")]
    public long WorkoutEntryId { get; set; }

    [Column("kg")]
    public double Kg { get; set; }

    [Column("reps")]
    public int Reps { get; set; }

}