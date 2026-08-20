using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("migrationtests")]
public class MigrationTest
{
    [Key]
    public long Id { get; set; }

    [Column("test_name")]
    public string TestName { get; set; } = default!;

    [Column("test_url")]
    public string TestUrl { get; set; } = default!;
}