using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("images")]
public class SaveImage
{
    [Key]
    public long Id { get; set; }

    [Column("image_name")]
    public string ImageName { get; set; } = default!;

    [Column("public_url")]
    public string PublicUrl { get; set; } = default!;

    [Column("test")]
    public string Test { get; set; } = default!;
}