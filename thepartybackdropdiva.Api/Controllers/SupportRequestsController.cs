using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using thepartybackdropdiva.Domain.Entities;
using thepartybackdropdiva.Infrastructure.Repositories;
using thepartybackdropdiva.Communication.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace thepartybackdropdiva.Api.Controllers;

public class CreateSupportRequestDto
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Subject { get; set; } = null!;
    public string Message { get; set; } = null!;
}

[ApiController]
[Route("api/[controller]")]
public class SupportRequestsController : ControllerBase
{
    private readonly ISupportRequestRepository _repository;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ICommunicationService _communicationService;

    public SupportRequestsController(
        ISupportRequestRepository repository, 
        UserManager<ApplicationUser> userManager,
        ICommunicationService communicationService)
    {
        _repository = repository;
        _userManager = userManager;
        _communicationService = communicationService;
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> CreateSupportRequest([FromBody] CreateSupportRequestDto dto)
    {
        // 1. Assignment Logic: Find first user in "Support" role
        var supportUsers = await _userManager.GetUsersInRoleAsync("Support");
        var assignedUser = supportUsers.FirstOrDefault();

        // 2. Create Entity
        var request = new SupportRequest
        {
            Name = dto.Name,
            Email = dto.Email,
            Subject = dto.Subject,
            Message = dto.Message,
            Status = "Pending",
            AssignedUserId = assignedUser?.Id
        };

        await _repository.AddAsync(request);

        // 3. Notifications
        // To User
        string userBody = $"Dear {dto.Name},\n\nWe have received your support request: \"{dto.Subject}\".";
        if (assignedUser != null)
        {
            userBody += $"\n\nSupport specialist {assignedUser.FirstName} {assignedUser.LastName} has been assigned to assist you.";
        }
        userBody += "\n\nWe will get back to you shortly.\n\nBest regards,\nThe Party Backdrop Diva Concierge";

        await _communicationService.SendEmailCustomerCareAsync(dto.Email, "Support Request Received", userBody);

        // To Support Staff
        if (assignedUser != null && !string.IsNullOrEmpty(assignedUser.Email))
        {
            string staffBody = $"Hello {assignedUser.FirstName},\n\nA new support request has been assigned to you.\n\nFrom: {dto.Name} ({dto.Email})\nSubject: {dto.Subject}\nMessage: {dto.Message}\n\nPlease attend to it as soon as possible.";
            await _communicationService.SendEmailCustomerCareAsync(assignedUser.Email, "New Assigned Support Request", staffBody);
        }

        return Ok(new { message = "Support request submitted and assigned.", id = request.Id });
    }

    [HttpGet]
    [Authorize(Roles = "Support,Admin")]
    public async Task<IActionResult> GetAllRequests()
    {
        var requests = await _repository.GetAllAsync();
        // Include assigned user info if possible (manually or via repo update)
        // For simplicity, returning the list. In a real app, I'd use .Include(r => r.AssignedUser)
        return Ok(requests);
    }
}
