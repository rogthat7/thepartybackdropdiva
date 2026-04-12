namespace thepartybackdropdiva.Application.DTOs;

public class BackdropThemeDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public string Style { get; set; } = string.Empty;
    public string Dimensions { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public int SetupComplexityInHours { get; set; }
}
