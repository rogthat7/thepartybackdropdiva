using Microsoft.AspNetCore.Mvc;
using thepartybackdropdiva.Communication.Interfaces;
using thepartybackdropdiva.Application.DTOs;
using thepartybackdropdiva.Infrastructure.Repositories;
using thepartybackdropdiva.Domain.Entities;

namespace thepartybackdropdiva.Api.Controllers;

public class ConsultationRequestDto
{
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Message { get; set; }
}

public class SupportEmailDto
{
    public string ToEmail { get; set; } = null!;
    public string Subject { get; set; } = null!;
    public string Message { get; set; } = null!;
}

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly ICommunicationService _communicationService;
    private readonly IConsultationRequestRepository _consultationRepository;

    public NotificationsController(ICommunicationService communicationService, IConsultationRequestRepository consultationRepository)
    {
        _communicationService = communicationService;
        _consultationRepository = consultationRepository;
    }

    [HttpPost("consultation")]
    public async Task<IActionResult> RequestConsultation([FromBody] ConsultationRequestDto request)
    {

        if (string.IsNullOrWhiteSpace(request.Email) && string.IsNullOrWhiteSpace(request.Phone))
        {
            return BadRequest("Must provide at least an email or phone number.");
        }

        // Save entry to database
        var consultation = new ConsultationRequest
        {
            Email = request.Email,
            Phone = request.Phone,
            Message = request.Message,
            Status = "Pending"
        };

        await _consultationRepository.AddAsync(consultation);

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

        return Ok(new { message = "Notification sent and request recorded successfully.", id = consultation.Id });
    }

    [HttpPost("support-confirmation")]
    public async Task<IActionResult> SendSupportConfirmation([FromBody] SupportEmailDto request)
    {
        // For support emails, we use the specific support address
        await _communicationService.SendEmailCustomerCareAsync(
            request.ToEmail,
            request.Subject,
            request.Message
        );

        return Ok(new { message = "Support confirmation email sent." });
    }
}
