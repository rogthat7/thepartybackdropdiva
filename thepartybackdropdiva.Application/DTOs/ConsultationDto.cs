namespace thepartybackdropdiva.Application.DTOs;

public class ConsultationDto
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Comments { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? AssignedAdvisorName { get; set; }
    public Guid? AssignedAdvisorId { get; set; }

    // Event context fields
    public string? EventType { get; set; }
    public DateTime? EventDate { get; set; }
    public string? GuestCount { get; set; }
    public string? VenueLocation { get; set; }
    public string? ServicesInterested { get; set; }
}

public class AdvisorDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Specialization { get; set; }
}

public class AssignAdvisorDto
{
    public Guid ConsultationRequestId { get; set; }
    public Guid AdvisorId { get; set; }
}
