namespace thepartybackdropdiva.Domain.Entities;

public class ConsultationRequest : BaseEntity
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Comments { get; set; }
    public string Status { get; set; } = "Pending";

    // Event context fields
    public string? EventType { get; set; }
    public DateTime? EventDate { get; set; }
    public string? GuestCount { get; set; }
    public string? VenueLocation { get; set; }
    public string? ServicesInterested { get; set; }
}
