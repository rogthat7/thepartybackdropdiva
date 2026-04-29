using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using thepartybackdropdiva.Application.Interfaces;
using thepartybackdropdiva.Domain.Entities;
using thepartybackdropdiva.Infrastructure.Repositories;

namespace thepartybackdropdiva.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IRepository<Booking> _bookingRepository;
    private readonly IRepository<ConsultationRequest> _consultationRepository;
    private readonly ICateringService _cateringService;
    private readonly IMediator _mediator;

    public AdminController(
        IRepository<Booking> bookingRepository, 
        IRepository<ConsultationRequest> consultationRepository,
        ICateringService cateringService,
        IMediator mediator)
    {
        _bookingRepository = bookingRepository;
        _consultationRepository = consultationRepository;
        _cateringService = cateringService;
        _mediator = mediator;
    }

    [HttpGet("bookings")]
    public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
    {
        var bookings = await _bookingRepository.GetAllAsync();
        return Ok(bookings);
    }

    [HttpGet("consultations")]
    public async Task<IActionResult> GetConsultationRequests()
    {
        var requests = await _consultationRepository.GetAllAsync();
        return Ok(requests.OrderByDescending(r => r.CreatedAt));
    }

    [HttpPatch("consultations/{id}/status")]
    public async Task<IActionResult> UpdateConsultationStatus(Guid id, [FromBody] UpdateStatusDto updateDto)
    {
        var request = await _consultationRepository.GetByIdAsync(id);
        if (request == null) return NotFound();

        request.Status = updateDto.Status;
        await _consultationRepository.UpdateAsync(request);

        return Ok(request);
    }

    [HttpDelete("consultations/{id}")]
    public async Task<IActionResult> DeleteConsultationRequest(Guid id)
    {
        var request = await _consultationRepository.GetByIdAsync(id);
        if (request == null) return NotFound();

        await _consultationRepository.DeleteAsync(request);
        return NoContent();
    }

    [HttpPost("bookings/{id}/followup")]
    public async Task<IActionResult> AddFollowUp(Guid id, [FromBody] AddFollowUpRequest request)
    {
        var command = new thepartybackdropdiva.Application.Bookings.Commands.AddFollowUpCommand(id, request.Note, User.Identity?.Name ?? "Admin");
        var result = await _mediator.Send(command);
        
        if (!result) return NotFound();
        return Ok();
    }

    // Catering Management Endpoints
    [HttpGet("catering/items")]
    public async Task<ActionResult<IEnumerable<thepartybackdropdiva.Application.DTOs.MenuItemDto>>> GetCateringItems()
    {
        var items = await _cateringService.GetAllMenuItemsAsync();
        return Ok(items);
    }

    [HttpPost("catering/items")]
    public async Task<ActionResult<thepartybackdropdiva.Application.DTOs.MenuItemDto>> CreateCateringItem([FromBody] thepartybackdropdiva.Application.DTOs.MenuItemDto dto)
    {
        var item = await _cateringService.CreateMenuItemAsync(dto);
        return Ok(item);
    }

    [HttpPut("catering/items/{id}")]
    public async Task<ActionResult<thepartybackdropdiva.Application.DTOs.MenuItemDto>> UpdateCateringItem(Guid id, [FromBody] thepartybackdropdiva.Application.DTOs.MenuItemDto dto)
    {
        var item = await _cateringService.UpdateMenuItemAsync(id, dto);
        return Ok(item);
    }

    [HttpDelete("catering/items/{id}")]
    public async Task<IActionResult> DeleteCateringItem(Guid id)
    {
        await _cateringService.DeleteMenuItemAsync(id);
        return NoContent();
    }

    [HttpGet("catering/menus")]
    public async Task<ActionResult<IEnumerable<thepartybackdropdiva.Application.DTOs.CateringMenuDto>>> GetCateringMenus()
    {
        var menus = await _cateringService.GetAllMenusAsync();
        return Ok(menus.Where(m => !m.IsCustom));
    }

    [HttpPost("catering/menus")]
    public async Task<ActionResult<thepartybackdropdiva.Application.DTOs.CateringMenuDto>> CreateCateringMenu([FromBody] thepartybackdropdiva.Application.DTOs.CateringMenuDto dto)
    {
        var menu = await _cateringService.CreateMenuAsync(dto);
        return Ok(menu);
    }

    [HttpPut("catering/menus/{id}")]
    public async Task<ActionResult<thepartybackdropdiva.Application.DTOs.CateringMenuDto>> UpdateCateringMenu(Guid id, [FromBody] thepartybackdropdiva.Application.DTOs.CateringMenuDto dto)
    {
        var menu = await _cateringService.UpdateMenuAsync(id, dto);
        return Ok(menu);
    }

    [HttpDelete("catering/menus/{id}")]
    public async Task<IActionResult> DeleteCateringMenu(Guid id)
    {
        await _cateringService.DeleteMenuAsync(id);
        return NoContent();
    }
}

public class AddFollowUpRequest
{
    public string Note { get; set; } = string.Empty;
}

public class UpdateStatusDto
{
    public string Status { get; set; } = string.Empty;
}
