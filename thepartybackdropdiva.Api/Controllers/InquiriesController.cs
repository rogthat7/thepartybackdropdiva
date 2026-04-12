using Microsoft.AspNetCore.Mvc;
using thepartybackdropdiva.Application.DTOs;

namespace thepartybackdropdiva.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InquiriesController : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<BookingResponseDto>> CreateInquiry([FromBody] BookingRequestDto request)
    {
        // Placeholder for booking logic utilizing PricingEngine
        // In a real scenario, this would be delegated to a BookingService

        var response = new BookingResponseDto
        {
            BookingId = Guid.NewGuid(),
            Status = "Inquiry Received",
            TotalEstimatedCost = 500.00m, // Mock value
            Message = "Your inquiry has been received. Our team will contact you shortly."
        };

        return Ok(response);
    }
}
