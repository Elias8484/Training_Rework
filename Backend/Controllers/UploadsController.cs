using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/uploads")]
public class UploadsController : ControllerBase
{
    public class UploadImageRequest{
        public IFormFile File { get; set; } = null!;
    }
    private readonly AppDbContext _context;
    private readonly string _imageFolder = "/mnt/usb/images";

    public UploadsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("images")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(15_000_000)]
    public async Task<IActionResult> UploadImage([FromForm] UploadImageRequest request)
    {
         var file = request.File;

        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        await using var stream = file.OpenReadStream();
        byte[] header = new byte[12];
        int read = await stream.ReadAsync(header, 0, header.Length);
        stream.Position = 0;

        bool isJpeg = read >= 3 && header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF;
        bool isPng = read >= 8 &&
                     header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47 &&
                     header[4] == 0x0D && header[5] == 0x0A && header[6] == 0x1A && header[7] == 0x0A;

        bool isHeic = read >= 12 &&
                      System.Text.Encoding.ASCII.GetString(header).Contains("ftypheic") ||
                      System.Text.Encoding.ASCII.GetString(header).Contains("ftypmif1");

        if (isHeic)
            return BadRequest("File is in HEIC format. Please convert to JPEG before uploading.");

        if (!isJpeg && !isPng)
            return BadRequest($"Unsupported format. Please upload JPEG or PNG.");

        var ext = isJpeg ? ".jpg" : ".png";
        var fileName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(_imageFolder, fileName);

        await using var fileStream = System.IO.File.Create(filePath);
        await stream.CopyToAsync(fileStream);

        var publicUrl = $"https://{Request.Host}/api/uploads/images/{fileName}";

        _context.SaveImages.Add(new SaveImage
        {
            ImageName = fileName,
            PublicUrl = publicUrl,
        });
        await _context.SaveChangesAsync();

        return Ok(new { fileName, publicUrl });
    }

    [HttpGet("images")]
    public async Task<IActionResult> GetAllImages()
    {
        var images = await _context.SaveImages
            .OrderByDescending(i => i.Id)
            .Select(i => new { i.Id, i.ImageName, i.PublicUrl })
            .ToListAsync();
        return Ok(images);
    }

    [HttpGet("images/{fileName}")]
    public IActionResult GetImage(string fileName)
    {
        var filePath = Path.Combine(_imageFolder, fileName);

        if (!System.IO.File.Exists(filePath))
            return NotFound();

        var ext = Path.GetExtension(fileName).ToLower();
        var contentType = ext == ".jpg" || ext == ".jpeg" ? "image/jpeg" : "image/png";

        return PhysicalFile(filePath, contentType);
    }
}