namespace thepartybackdropdiva.Domain.Entities;

public class BackdropTheme : ServiceItem
{
    public string Style { get; set; } = string.Empty; // e.g. "Rustic", "Modern", "Luxury"
    public string Dimensions { get; set; } = string.Empty;
    public int SetupComplexityInHours { get; set; }
}
