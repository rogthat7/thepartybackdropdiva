namespace thepartybackdropdiva.Domain.Entities;

public class MenuItem : ServiceItem
{
    public string Category { get; set; } = string.Empty; // e.g., Appetizer, Main Course
    public bool IsVegetarian { get; set; }
    public bool IsGlutenFree { get; set; }
    
    // Link back to a Catering Menu Package
    public Guid? CateringMenuId { get; set; }
    public CateringMenu? CateringMenu { get; set; }
}
