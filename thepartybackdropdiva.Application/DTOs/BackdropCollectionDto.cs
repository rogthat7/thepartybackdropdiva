namespace thepartybackdropdiva.Application.DTOs;

public class BackdropCollectionDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? CoverImageUrl { get; set; }
    public List<BackdropImageDto> Images { get; set; } = new List<BackdropImageDto>();
}

public class BackdropImageDto
{
    public Guid Id { get; set; }
    public Guid BackdropCollectionId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string[]? AdditionalImageUrls { get; set; }
    public string Title { get; set; } = string.Empty;
}
