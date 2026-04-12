using thepartybackdropdiva.Domain.Entities;

namespace thepartybackdropdiva.Application.Services;

public interface IPricingEngine
{
    decimal CalculateCateringCost(CateringMenu menu, int guestCount);
    decimal CalculateBackdropCost(BackdropTheme backdrop, int rentalDurationHours);
}

public class PricingEngine : IPricingEngine
{
    public decimal CalculateCateringCost(CateringMenu menu, int guestCount)
    {
        // Simple tier logic
        decimal tierMultiplier = 1.0m;
        
        if (guestCount >= 200) tierMultiplier = 0.85m;      // 15% discount for 200+
        else if (guestCount >= 100) tierMultiplier = 0.90m; // 10% discount for 100+
        else if (guestCount >= 50) tierMultiplier = 0.95m;  // 5% discount for 50+
        else if (guestCount < 20) tierMultiplier = 1.2m;    // 20% surcharge for very small groups
        
        var baseCost = menu.BasePricePerPlate * guestCount;
        return baseCost * tierMultiplier;
    }

    public decimal CalculateBackdropCost(BackdropTheme backdrop, int rentalDurationHours)
    {
        var setupFee = backdrop.SetupComplexityInHours * 50.0m; // $50/hr for setup
        
        // Base price covers up to 4 hours.
        decimal rentalFee = backdrop.BasePrice;
        
        if (rentalDurationHours > 4)
        {
            var extraHours = rentalDurationHours - 4;
            rentalFee += extraHours * (backdrop.BasePrice * 0.10m); // 10% of base price per extra hour
        }
        
        return rentalFee + setupFee;
    }
}
