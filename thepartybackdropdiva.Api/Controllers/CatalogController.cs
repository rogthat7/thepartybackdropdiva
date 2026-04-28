using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using thepartybackdropdiva.Application.DTOs;
using thepartybackdropdiva.Application.Interfaces;

namespace thepartybackdropdiva.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CatalogController : ControllerBase
{
    private readonly ICateringService _cateringService;
    private readonly IBackdropService _backdropService;

    public CatalogController(ICateringService cateringService, IBackdropService backdropService)
    {
        _cateringService = cateringService;
        _backdropService = backdropService;
    }

    [HttpGet("menus")]
    public async Task<ActionResult<IEnumerable<CateringMenuDto>>> GetMenus()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? userId = string.IsNullOrEmpty(userIdString) ? null : Guid.Parse(userIdString);

        var menus = await _cateringService.GetAllMenusAsync(userId);
        return Ok(menus);
    }

    [HttpGet("backdrops")]
    public async Task<ActionResult<IEnumerable<BackdropThemeDto>>> GetBackdrops()
    {
        var backdrops = await _backdropService.GetCatalogAsync();
        return Ok(backdrops);
    }

    [HttpPost("menus/custom")]
    public async Task<ActionResult<CateringMenuDto>> CreateCustomMenu([FromBody] CreateCustomMenuRequest request)
    {
        // Try to get UserId from Claims if logged in, otherwise null for guests
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? userId = string.IsNullOrEmpty(userIdString) ? null : Guid.Parse(userIdString);

        var menu = await _cateringService.CreateCustomMenuAsync(request.Name, userId, request.MenuItemIds);
        return Ok(menu);
    }

    [HttpPut("menus/custom/{id}")]
    public async Task<ActionResult<CateringMenuDto>> UpdateCustomMenu(Guid id, [FromBody] CreateCustomMenuRequest request)
    {
        Console.WriteLine($"[DEBUG] Updating Custom Menu ID: {id}, New Name: {request.Name}");
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? userId = string.IsNullOrEmpty(userIdString) ? null : Guid.Parse(userIdString);

        var menu = await _cateringService.UpdateCustomMenuAsync(id, request.Name, userId, request.MenuItemIds);
        return Ok(menu);
    }

    [HttpDelete("menus/custom/{id}")]
    public async Task<IActionResult> DeleteCustomMenu(Guid id)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? userId = string.IsNullOrEmpty(userIdString) ? null : Guid.Parse(userIdString);

        await _cateringService.DeleteCustomMenuAsync(id, userId);
        return NoContent();
    }
}

public class CreateCustomMenuRequest
{
    public string Name { get; set; } = "Custom Package";
    public List<Guid> MenuItemIds { get; set; } = new();
}
