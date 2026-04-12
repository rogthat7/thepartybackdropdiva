namespace thepartybackdropdiva.Domain.Entities;

public class Booking : BaseEntity
{
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    
    public DateTime EventDate { get; set; }
    public string EventLocation { get; set; } = string.Empty;
    public int ExpectedGuestCount { get; set; }
    
    public string Status { get; set; } = "Inquiry"; // Inquiry, Confirmed, Completed, Cancelled
    
    // Relationships
    public Invoice? Invoice { get; set; }
    
    public ICollection<ServiceItem> ServiceItems { get; set; } = new List<ServiceItem>();
}
