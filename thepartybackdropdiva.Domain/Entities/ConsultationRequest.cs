namespace thepartybackdropdiva.Domain.Entities;

public class ConsultationRequest : BaseEntity
{
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Message { get; set; }
    public string Status { get; set; } = "Pending";
}
