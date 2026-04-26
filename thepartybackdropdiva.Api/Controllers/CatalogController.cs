using Microsoft.AspNetCore.Mvc;
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
        var menus = await _cateringService.GetAllMenusAsync();
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
        var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        Guid? userId = string.IsNullOrEmpty(userIdString) ? null : Guid.Parse(userIdString);

        var menu = await _cateringService.CreateCustomMenuAsync(request.Name, userId, request.MenuItemIds);
        return Ok(menu);
    }
}

public class CreateCustomMenuRequest
{
    public string Name { get; set; } = "Custom Package";
    public List<Guid> MenuItemIds { get; set; } = new();
}
