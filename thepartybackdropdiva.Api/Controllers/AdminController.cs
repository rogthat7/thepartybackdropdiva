using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using thepartybackdropdiva.Application.Interfaces;
using thepartybackdropdiva.Domain.Entities;
using thepartybackdropdiva.Infrastructure.Repositories;

namespace thepartybackdropdiva.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
// [Authorize] // Commented out for initial testing without token
public class AdminController : ControllerBase
{
    private readonly IRepository<Booking> _bookingRepository;

    public AdminController(IRepository<Booking> bookingRepository)
    {
        _bookingRepository = bookingRepository;
    }

    [HttpGet("bookings")]
    public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
    {
        var bookings = await _bookingRepository.GetAllAsync();
        return Ok(bookings);
    }
}
