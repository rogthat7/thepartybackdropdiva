using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using thepartybackdropdiva.Application.Interfaces;
using thepartybackdropdiva.Domain.Entities;
using thepartybackdropdiva.Infrastructure.Repositories;
using thepartybackdropdiva.Infrastructure.Data;
using thepartybackdropdiva.Application.DTOs;
using Microsoft.EntityFrameworkCore;

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
    private readonly AppDbContext _context;

    public AdminController(
        IRepository<Booking> bookingRepository, 
        IRepository<ConsultationRequest> consultationRepository,
        ICateringService cateringService,
        IMediator mediator,
        AppDbContext context)
    {
        _bookingRepository = bookingRepository;
        _consultationRepository = consultationRepository;
        _cateringService = cateringService;
        _mediator = mediator;
        _context = context;
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
        var requests = await _context.ConsultationRequests
            .Select(r => new ConsultationDto
            {
                Id = r.Id,
                Name = r.Name,
                Email = r.Email,
                Phone = r.Phone,
                Comments = r.Comments,
                Status = r.Status,
                CreatedAt = r.CreatedAt,
                EventType = r.EventType,
                EventDate = r.EventDate,
                GuestCount = r.GuestCount,
                VenueLocation = r.VenueLocation,
                ServicesInterested = r.ServicesInterested,
                AssignedAdvisorId = _context.AdvisorActiveConsultations
                    .Where(ac => ac.ConsultationRequestId == r.Id)
                    .Select(ac => (Guid?)ac.AdvisorId)
                    .FirstOrDefault(),
                AssignedAdvisorName = _context.AdvisorActiveConsultations
                    .Where(ac => ac.ConsultationRequestId == r.Id)
                    .Select(ac => $"{ac.Advisor.User.FirstName} {ac.Advisor.User.LastName}")
                    .FirstOrDefault()
            })
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return Ok(requests);
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

    [HttpPost("consultations/convert")]
    public async Task<IActionResult> ConvertConsultationToBooking([FromBody] thepartybackdropdiva.Application.DTOs.ConvertToBookingDto dto)
    {
        var consultation = await _consultationRepository.GetByIdAsync(dto.ConsultationId);
        if (consultation == null) return NotFound("Consultation request not found.");

        if (consultation.Status == "Converted")
            return BadRequest("This consultation has already been converted to an event.");

        // Create new Booking from Consultation data
        var booking = new Booking
        {
            CustomerName = consultation.Name ?? "Unknown",
            CustomerEmail = consultation.Email ?? string.Empty,
            CustomerPhone = consultation.Phone ?? string.Empty,
            EventDate = dto.OverrideEventDate ?? consultation.EventDate ?? DateTime.UtcNow.AddDays(30),
            EventLocation = dto.OverrideLocation ?? consultation.VenueLocation ?? "TBD",
            ExpectedGuestCount = dto.OverrideGuestCount ?? (int.TryParse(consultation.GuestCount, out var gc) ? gc : 0),
            Status = "Confirmed",
            CreatedAt = DateTime.UtcNow
        };

        // Handle Service Items if provided
        if (dto.SelectedServiceItemIds != null && dto.SelectedServiceItemIds.Any())
        {
            // Note: In a real app, you'd fetch these from a repository
            // For now, we'll assume they are added later or via a separate service call
        }

        await _bookingRepository.AddAsync(booking);

        // Update Consultation Status
        consultation.Status = "Converted";
        await _consultationRepository.UpdateAsync(consultation);

        return Ok(new { Message = "Consultation successfully converted to event.", BookingId = booking.Id });
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
