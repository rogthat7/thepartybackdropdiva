namespace thepartybackdropdiva.Communication.Interfaces;

public interface ICommunicationService
{
    Task SendEmailNotificationAsync(string email, string subject, string message);
    Task SendEmailCustomerCareAsync(string email, string subject, string message);
    Task SendSmsAsync(string phone, string message);
    Task SendWhatsAppAsync(string phone, string message);
    Task SendSocialMediaMessageAsync(string platform, string handle, string message);
}
