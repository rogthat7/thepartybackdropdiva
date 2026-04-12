using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

    public AdminController(
        IRepository<Booking> bookingRepository, 
        IRepository<ConsultationRequest> consultationRepository)
    {
        _bookingRepository = bookingRepository;
        _consultationRepository = consultationRepository;
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
}

public class UpdateStatusDto
{
    public string Status { get; set; } = string.Empty;
}
