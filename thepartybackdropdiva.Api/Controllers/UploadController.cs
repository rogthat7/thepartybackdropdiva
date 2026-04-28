using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using thepartybackdropdiva.Domain.Interfaces;

namespace thepartybackdropdiva.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IStorageService _storageService;

    public UploadController(IStorageService storageService)
    {
        _storageService = storageService;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        using var stream = file.OpenReadStream();
        var url = await _storageService.UploadAsync(stream, file.FileName, file.ContentType);

        return Ok(new { url });
    }
}
