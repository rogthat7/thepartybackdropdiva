namespace thepartybackdropdiva.Application.DTOs;

public class MenuItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public string Category { get; set; } = string.Empty;
    public bool IsVegetarian { get; set; }
    public bool IsGlutenFree { get; set; }
    public string? ImageUrl { get; set; }
}
