namespace thepartybackdropdiva.Domain.Entities;

public class CateringMenu : BaseEntity
{
    public string Name { get; set; } = string.Empty; // e.g. "Silver Package", "Gold Package"
    public string Description { get; set; } = string.Empty;
    public decimal BasePricePerPlate { get; set; }
    
    public ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
}
