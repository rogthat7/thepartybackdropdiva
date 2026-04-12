using Microsoft.AspNetCore.Mvc;
using thepartybackdropdiva.Communication.Interfaces;
using thepartybackdropdiva.Application.DTOs;

namespace thepartybackdropdiva.Api.Controllers;

public class ConsultationRequestDto
{
    public string? Email { get; set; }
    public string? Phone { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly ICommunicationService _communicationService;

    public NotificationsController(ICommunicationService communicationService)
    {
        _communicationService = communicationService;
    }

    [HttpPost("consultation")]
    public async Task<IActionResult> RequestConsultation([FromBody] ConsultationRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) && string.IsNullOrWhiteSpace(request.Phone))
        {
            return BadRequest("Must provide at least an email or phone number.");
        }

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            await _communicationService.SendEmailNotificationAsync(
                request.Email,
                "Consultation Request Received",
                "Thank you for reaching out! We have received your consultation request and will get back to you shortly."
            );
        }

        if (!string.IsNullOrWhiteSpace(request.Phone))
        {
            await _communicationService.SendWhatsAppAsync(
                request.Phone,
                "Thank you for reaching out! We have received your consultation request and will get back to you shortly."
            );
        }

        return Ok(new { message = "Notification sent successfully." });
    }
}
