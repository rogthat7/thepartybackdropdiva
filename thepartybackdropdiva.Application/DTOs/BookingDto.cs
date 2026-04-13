namespace thepartybackdropdiva.Application.DTOs;

public class FollowUpDto
{
    public Guid Id { get; set; }
    public string Note { get; set; } = string.Empty;
    public string AdminName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class BookingDto
{
    public Guid Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public string EventLocation { get; set; } = string.Empty;
    public List<FollowUpDto> FollowUps { get; set; } = new();
}
