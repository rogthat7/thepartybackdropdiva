using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using thepartybackdropdiva.Application.DTOs;
using thepartybackdropdiva.Domain.Entities;
using thepartybackdropdiva.Infrastructure.Data;
using System.Security.Claims;

namespace thepartybackdropdiva.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AdvisorsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdvisorsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<AdvisorDto>>> GetAdvisors()
    {
        var advisors = await _context.Advisors
            .Include(a => a.User)
            .Where(a => a.IsActive)
            .Select(a => new AdvisorDto
            {
                Id = a.Id,
                Name = $"{a.User.FirstName} {a.User.LastName}",
                Specialization = a.Specialization
            })
            .ToListAsync();

        return Ok(advisors);
    }

    [HttpPost("assign")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AssignAdvisor([FromBody] AssignAdvisorDto dto)
    {
        var consultation = await _context.ConsultationRequests.FindAsync(dto.ConsultationRequestId);
        if (consultation == null) return NotFound("Consultation request not found.");

        var advisor = await _context.Advisors.FindAsync(dto.AdvisorId);
        if (advisor == null) return NotFound("Advisor not found.");

        // Remove existing assignment if any
        var existing = await _context.AdvisorActiveConsultations
            .FirstOrDefaultAsync(ac => ac.ConsultationRequestId == dto.ConsultationRequestId);
        if (existing != null)
        {
            _context.AdvisorActiveConsultations.Remove(existing);
        }

        var assignment = new AdvisorActiveConsultation
        {
            AdvisorId = dto.AdvisorId,
            ConsultationRequestId = dto.ConsultationRequestId,
            AssignedAt = DateTime.UtcNow
        };

        _context.AdvisorActiveConsultations.Add(assignment);
        
        // Update status
        consultation.Status = "Assigned";
        
        await _context.SaveChangesAsync();

        return Ok(new { message = "Advisor assigned successfully." });
    }

    [HttpGet("my-consultations")]
    [Authorize(Roles = "Advisor,Admin")]
    public async Task<ActionResult<IEnumerable<ConsultationDto>>> GetMyConsultations()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();
        
        var userId = Guid.Parse(userIdClaim.Value);
        
        // Find advisor profile for this user
        var advisor = await _context.Advisors.FirstOrDefaultAsync(a => a.UserId == userId);
        if (advisor == null && !User.IsInRole("Admin")) return Forbid();

        var query = _context.AdvisorActiveConsultations
            .Include(ac => ac.ConsultationRequest)
            .Include(ac => ac.Advisor)
            .ThenInclude(a => a.User)
            .AsQueryable();

        if (!User.IsInRole("Admin"))
        {
            query = query.Where(ac => ac.AdvisorId == advisor!.Id);
        }

        var results = await query
            .Select(ac => new ConsultationDto
            {
                Id = ac.ConsultationRequest.Id,
                Name = ac.ConsultationRequest.Name,
                Email = ac.ConsultationRequest.Email,
                Phone = ac.ConsultationRequest.Phone,
                Comments = ac.ConsultationRequest.Comments,
                Status = ac.ConsultationRequest.Status,
                CreatedAt = ac.ConsultationRequest.CreatedAt,
                EventType = ac.ConsultationRequest.EventType,
                EventDate = ac.ConsultationRequest.EventDate,
                GuestCount = ac.ConsultationRequest.GuestCount,
                VenueLocation = ac.ConsultationRequest.VenueLocation,
                ServicesInterested = ac.ConsultationRequest.ServicesInterested,
                AssignedAdvisorName = $"{ac.Advisor.User.FirstName} {ac.Advisor.User.LastName}"
            })
            .ToListAsync();

        return Ok(results);
    }
}
