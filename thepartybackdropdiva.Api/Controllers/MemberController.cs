using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using thepartybackdropdiva.Application.Bookings.Queries;
using thepartybackdropdiva.Application.DTOs;

namespace thepartybackdropdiva.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MemberController : ControllerBase
{
    private readonly IMediator _mediator;

    public MemberController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("my-events")]
    public async Task<ActionResult<List<BookingDto>>> GetMyEvents()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var userId))
        {
            return Unauthorized();
        }

        var query = new GetMemberEventsQuery(userId);
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
