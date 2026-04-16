using System.ComponentModel.DataAnnotations.Schema;

namespace thepartybackdropdiva.Domain.Entities;

public class AdvisorActiveConsultation : BaseEntity
{
    public Guid AdvisorId { get; set; }
    
    [ForeignKey("AdvisorId")]
    public Advisor Advisor { get; set; } = null!;

    public Guid ConsultationRequestId { get; set; }
    
    [ForeignKey("ConsultationRequestId")]
    public ConsultationRequest ConsultationRequest { get; set; } = null!;

    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
}
