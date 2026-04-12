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
}
