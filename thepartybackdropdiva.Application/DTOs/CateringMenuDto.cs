namespace thepartybackdropdiva.Application.DTOs;

public class CateringMenuDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal BasePricePerPlate { get; set; }

    public List<MenuItemDto> MenuItems { get; set; } = new();
    public bool IsCustom { get; set; }
    public Guid? UserId { get; set; }
    public string? Theme { get; set; }
}
