using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace thepartybackdropdiva.Domain.Entities;

public class FollowUp : BaseEntity
{
    public Guid? BookingId { get; set; }
    
    [ForeignKey("BookingId")]
    public Booking? Booking { get; set; }

    public Guid? ConsultationRequestId { get; set; }

    [ForeignKey("ConsultationRequestId")]
    public ConsultationRequest? ConsultationRequest { get; set; }
    
    [Required]
    public string Note { get; set; } = string.Empty;
    
    public string AdminName { get; set; } = "Admin";
}
