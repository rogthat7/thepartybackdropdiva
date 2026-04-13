using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace thepartybackdropdiva.Domain.Entities;

public class FollowUp : BaseEntity
{
    public Guid BookingId { get; set; }
    
    [Required]
    public string Note { get; set; } = string.Empty;
    
    public string AdminName { get; set; } = "Admin";

    // Navigation property
    [ForeignKey("BookingId")]
    public Booking Booking { get; set; } = null!;
}
