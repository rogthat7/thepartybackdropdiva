namespace thepartybackdropdiva.Application.DTOs;

public class ConvertToBookingDto
{
    public Guid ConsultationId { get; set; }
    public DateTime? OverrideEventDate { get; set; }
    public string? OverrideLocation { get; set; }
    public int? OverrideGuestCount { get; set; }
    public List<Guid>? SelectedServiceItemIds { get; set; }
}
