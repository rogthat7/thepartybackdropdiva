namespace thepartybackdropdiva.Domain.Entities;

public class SupportRequest : BaseEntity
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Subject { get; set; } = null!;
    public string Message { get; set; } = null!;
    public string Status { get; set; } = "Pending";
    public Guid? AssignedUserId { get; set; }
    public ApplicationUser? AssignedUser { get; set; }
}
