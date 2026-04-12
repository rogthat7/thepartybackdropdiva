using Microsoft.Extensions.Logging;
using thepartybackdropdiva.Communication.Interfaces;

namespace thepartybackdropdiva.Communication.Services;

public class CommunicationService : ICommunicationService
{
    private readonly ILogger<CommunicationService> _logger;

    public CommunicationService(ILogger<CommunicationService> logger)
    {
        _logger = logger;
    }

    public Task SendEmailNotificationAsync(string email, string subject, string message)
    {
        // Mock implementation for sending email notification
        _logger.LogInformation("Sending Notification Email to {Email}: [{Subject}] {Message}", email, subject, message);
        return Task.CompletedTask;
    }

    public Task SendEmailCustomerCareAsync(string email, string subject, string message)
    {
        // Mock implementation for sending customer care email
        _logger.LogInformation("Sending Customer Care Email to {Email}: [{Subject}] {Message}", email, subject, message);
        return Task.CompletedTask;
    }

    public Task SendSmsAsync(string phone, string message)
    {
        // Mock implementation
        _logger.LogInformation("Sending SMS to {Phone}: {Message}", phone, message);
        return Task.CompletedTask;
    }

    public Task SendWhatsAppAsync(string phone, string message)
    {
        // Mock implementation
        _logger.LogInformation("Sending WhatsApp message to {Phone}: {Message}", phone, message);
        return Task.CompletedTask;
    }

    public Task SendSocialMediaMessageAsync(string platform, string handle, string message)
    {
        // Mock implementation
        _logger.LogInformation("Sending Social Media message to {Handle} on {Platform}: {Message}", handle, platform, message);
        return Task.CompletedTask;
    }
}
