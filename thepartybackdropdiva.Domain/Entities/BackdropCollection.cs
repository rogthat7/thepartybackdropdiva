namespace thepartybackdropdiva.Domain.Entities;

public class BackdropCollection : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? CoverImageUrl { get; set; }

    public ICollection<BackdropImage> Images { get; set; } = new List<BackdropImage>();
}
