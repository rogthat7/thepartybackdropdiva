namespace thepartybackdropdiva.Domain.Entities;

public class ServiceItem : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public string ItemType { get; set; } = string.Empty; // e.g. "Food", "Decor"

    // Optional relation to Vendor
    public Guid? VendorId { get; set; }
    public Vendor? Vendor { get; set; }
    
    public string? ImageUrl { get; set; }

    // Many-to-Many with Bookings
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
