namespace thepartybackdropdiva.Domain.Entities;

public class BackdropImage : BaseEntity
{
    public Guid BackdropCollectionId { get; set; }
    public BackdropCollection? Collection { get; set; }
    
    public string ImageUrl { get; set; } = string.Empty;
    public string[]? AdditionalImageUrls { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}
