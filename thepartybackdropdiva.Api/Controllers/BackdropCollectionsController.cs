using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using thepartybackdropdiva.Application.DTOs;
using thepartybackdropdiva.Application.Interfaces;

namespace thepartybackdropdiva.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BackdropCollectionsController : ControllerBase
{
    private readonly IBackdropCollectionService _collectionService;

    public BackdropCollectionsController(IBackdropCollectionService collectionService)
    {
        _collectionService = collectionService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BackdropCollectionDto>>> GetCollections()
    {
        var collections = await _collectionService.GetAllCollectionsAsync();
        return Ok(collections);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BackdropCollectionDto>> GetCollection(Guid id)
    {
        var collection = await _collectionService.GetCollectionByIdAsync(id);
        if (collection == null) return NotFound();
        return Ok(collection);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<BackdropCollectionDto>> CreateCollection(BackdropCollectionDto dto)
    {
        var result = await _collectionService.CreateCollectionAsync(dto);
        return CreatedAtAction(nameof(GetCollection), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateCollection(Guid id, BackdropCollectionDto dto)
    {
        await _collectionService.UpdateCollectionAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCollection(Guid id)
    {
        await _collectionService.DeleteCollectionAsync(id);
        return NoContent();
    }

    // Image Management
    [HttpPost("{id}/images")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<BackdropImageDto>> AddImage(Guid id, BackdropImageDto dto)
    {
        var result = await _collectionService.AddImageAsync(id, dto);
        return Ok(result);
    }

    [HttpPut("{id}/images/{imageId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateImage(Guid id, Guid imageId, BackdropImageDto dto)
    {
        await _collectionService.UpdateImageAsync(id, imageId, dto);
        return NoContent();
    }

    [HttpDelete("{id}/images/{imageId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteImage(Guid id, Guid imageId)
    {
        await _collectionService.DeleteImageAsync(id, imageId);
        return NoContent();
    }
}
