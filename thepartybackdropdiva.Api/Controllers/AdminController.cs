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
    private readonly IMediator _mediator;

    public AdminController(
        IRepository<Booking> bookingRepository, 
        IRepository<ConsultationRequest> consultationRepository,
        IMediator mediator)
    {
        _bookingRepository = bookingRepository;
        _consultationRepository = consultationRepository;
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
}

public class AddFollowUpRequest
{
    public string Note { get; set; } = string.Empty;
}

public class UpdateStatusDto
{
    public string Status { get; set; } = string.Empty;
}
