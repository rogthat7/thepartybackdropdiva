using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Net.Smtp;
using thepartybackdropdiva.Communication.Interfaces;
using thepartybackdropdiva.Communication.Models;

namespace thepartybackdropdiva.Communication.Services;

public class CommunicationService : ICommunicationService
{
    private readonly ILogger<CommunicationService> _logger;
    private readonly EmailSettings _emailSettings;

    public CommunicationService(ILogger<CommunicationService> logger, IOptions<EmailSettings> emailSettings)
    {
        _logger = logger;
        _emailSettings = emailSettings.Value;
    }

    public async Task SendEmailNotificationAsync(string email, string subject, string message)
    {
        try
        {
            var mimeMessage = new MimeMessage();
            mimeMessage.From.Add(new MailboxAddress(_emailSettings.FromName, _emailSettings.FromEmail));
            mimeMessage.To.Add(new MailboxAddress("", email));
            mimeMessage.Subject = subject;

            mimeMessage.Body = new TextPart("plain")
            {
                Text = message
            };

            using var client = new SmtpClient();
            // In development, we might not want to use SSL if using Mailpit
            await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.SmtpPort, MailKit.Security.SecureSocketOptions.None);

            if (!string.IsNullOrEmpty(_emailSettings.SmtpUser) && !string.IsNullOrEmpty(_emailSettings.SmtpPassword))
            {
                await client.AuthenticateAsync(_emailSettings.SmtpUser, _emailSettings.SmtpPassword);
            }

            await client.SendAsync(mimeMessage);
            await client.DisconnectAsync(true);

            _logger.LogInformation("Successfully sent Notification Email to {Email}: [{Subject}]", email, subject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending Notification Email to {Email}: {Message}", email, ex.Message);
            throw;
        }
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
