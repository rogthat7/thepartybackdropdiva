namespace thepartybackdropdiva.Domain.Entities;

public class MenuItem : ServiceItem
{
    public string Category { get; set; } = string.Empty; // e.g., Appetizer, Main Course
    public bool IsVegetarian { get; set; }
    public bool IsGlutenFree { get; set; }
    
    public ICollection<CateringMenu> CateringMenus { get; set; } = new List<CateringMenu>();
}
