namespace thepartybackdropdiva.Domain.Entities;

public class Invoice : BaseEntity
{
    public Guid BookingId { get; set; }
    public Booking? Booking { get; set; }
    
    public decimal Subtotal { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal TotalAmount { get; set; }
    
    public string Status { get; set; } = "Pending"; // Pending, PartiallyPaid, Paid, Overdue

    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
