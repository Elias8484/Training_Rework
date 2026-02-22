using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Backend.Models;   

[Table("images")]
public class SaveImage : BaseModel
{
    [PrimaryKey("id", false)]
    public long Id { get; set; }

    [Column("image_name")]
    public string ImageName { get; set; } = default!;

    [Column("public_url")]
    public string PublicUrl { get; set; } = default!;
}