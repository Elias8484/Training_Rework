using Google.Cloud.Storage.V1;
using Microsoft.AspNetCore.Mvc;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/uploads")]
public class UploadsController : ControllerBase
{
    private readonly Supabase.Client _supabase;
    private readonly StorageClient _storage;
    private readonly string _bucketName;

    public UploadsController(Supabase.Client supabase, StorageClient storageClient, string bucket)
    {
        _supabase = supabase;
        _storage = storageClient;
        _bucketName = bucket;
    }

    [HttpPost("images")]
    [RequestSizeLimit(15_000_000)] // 15 MB
    public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        // Read a few bytes to detect real file type
        await using var stream = file.OpenReadStream();
        byte[] header = new byte[12];
        int read = await stream.ReadAsync(header, 0, header.Length);
        stream.Position = 0; // Reset stream for GCS upload

        // Check for JPEG (FF D8 FF) or PNG (89 50 4E 47 ...)
        bool isJpeg = read >= 3 && header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF;
        bool isPng = read >= 8 &&
                     header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47 &&
                     header[4] == 0x0D && header[5] == 0x0A && header[6] == 0x1A && header[7] == 0x0A;

        // HEIC detection (usually has "ftypheic" in the first 12 bytes)
        bool isHeic = read >= 12 && 
                      System.Text.Encoding.ASCII.GetString(header).Contains("ftypheic") || 
                      System.Text.Encoding.ASCII.GetString(header).Contains("ftypmif1");

        if (isHeic)
        {
            return BadRequest("File is in HEIC format. Please convert to JPEG on the mobile device before uploading.");
        }

        if (!isJpeg && !isPng)
            return BadRequest($"Unsupported format. Please upload JPEG or PNG. (Detected Content-Type: {file.ContentType})");

        var ext = isJpeg ? ".jpg" : ".png";
        var contentType = isJpeg ? "image/jpeg" : "image/png";

        var objectName = $"uploads/{DateTime.UtcNow:yyyy/MM}/{Guid.NewGuid()}{ext}";

        // Upload to GCS
        await _storage.UploadObjectAsync(
            bucket: _bucketName,
            objectName: objectName,
            contentType: contentType,
            source: stream
        );

        // Make object public
        await _storage.UpdateObjectAsync(new Google.Apis.Storage.v1.Data.Object
        {
            Bucket = _bucketName,
            Name = objectName,
            Acl = new List<Google.Apis.Storage.v1.Data.ObjectAccessControl>
            {
                new() { Entity = "allUsers", Role = "READER" }
            }
        });

        var publicUrl = $"https://storage.googleapis.com/{_bucketName}/{objectName}";

        // Save metadata to Supabase
        await _supabase.From<SaveImage>().Insert(new SaveImage
        {
            ImageName = objectName,
            PublicUrl = publicUrl,
        });

        return Ok(new { objectName, publicUrl });
    }
}