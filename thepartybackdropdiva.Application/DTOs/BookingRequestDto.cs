namespace thepartybackdropdiva.Application.DTOs;

public class BookingRequestDto
{
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    
    public DateTime EventDate { get; set; }
    public string EventLocation { get; set; } = string.Empty;
    public int ExpectedGuestCount { get; set; }
    
    // IDs of selected services (Menu Items or Backdrops)
    public List<Guid> SelectedServiceItemIds { get; set; } = new();
}

public class BookingResponseDto
{
    public Guid BookingId { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal TotalEstimatedCost { get; set; }
    public string Message { get; set; } = string.Empty;
}
