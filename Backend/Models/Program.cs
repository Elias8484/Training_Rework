using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("programs")]
public class Program
{
    [Key]
    [Column("program_id")]
    public long Id { get; set; }

    [ForeignKey("User")]
    [Column("user_id")]
    public long UserId { get; set; }

    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("created_at")]
    public DateTime? CreatedAt { get; set; }
}