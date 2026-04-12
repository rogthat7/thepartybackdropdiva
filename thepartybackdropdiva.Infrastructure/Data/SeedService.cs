using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using thepartybackdropdiva.Domain.Entities;

namespace thepartybackdropdiva.Infrastructure.Data;

public static class SeedService
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        var context = serviceProvider.GetRequiredService<AppDbContext>();

        await context.Database.MigrateAsync();

        if (!await context.CateringMenus.AnyAsync())
        {
            var menu = new CateringMenu
            {
                Name = "Gold Package",
                Description = "Our premium catering package including 3 courses.",
                BasePricePerPlate = 45.00m
            };

            var item1 = new MenuItem
            {
                Name = "Truffle Risotto",
                Description = "Creamy arborio rice with wild mushrooms and truffle oil.",
                Category = "Main Course",
                BasePrice = 15.00m,
                IsVegetarian = true,
                IsGlutenFree = true,
                ItemType = "Menu",
                ImageUrl = "/images/catering/risotto.png",
                CateringMenu = menu
            };

            var item2 = new MenuItem
            {
                Name = "Herb-Crusted Salmon",
                Description = "Perfectly pan-seared salmon fillet with crispy herb crust.",
                Category = "Main Course",
                BasePrice = 25.00m,
                IsVegetarian = false,
                IsGlutenFree = true,
                ItemType = "Menu",
                ImageUrl = "/images/catering/salmon.png",
                CateringMenu = menu
            };

            var item3 = new MenuItem
            {
                Name = "Mini Caprese Skewers",
                Description = "Bite-sized cherry tomatoes, mozzarella, and basil drizzled with balsamic.",
                Category = "Appetizer",
                BasePrice = 8.00m,
                IsVegetarian = true,
                IsGlutenFree = true,
                ItemType = "Menu",
                ImageUrl = "/images/catering/caprese.png",
                CateringMenu = menu
            };

            menu.MenuItems.Add(item1);
            menu.MenuItems.Add(item2);
            menu.MenuItems.Add(item3);

            context.CateringMenus.Add(menu);
            context.MenuItems.Add(item1);
            context.MenuItems.Add(item2);
            context.MenuItems.Add(item3);
            await context.SaveChangesAsync();
        }

        if (!await context.BackdropThemes.AnyAsync())
        {
            context.BackdropThemes.Add(new BackdropTheme
            {
                Name = "Classic Floral",
                Description = "A pristine white and blush pink rose wall.",
                Style = "Luxury",
                Dimensions = "8ft x 8ft",
                ImageUrl = "/images/backdrops/floral.png",
                SetupComplexityInHours = 2,
                BasePrice = 300.00m,
                ItemType = "Backdrop"
            });

            context.BackdropThemes.Add(new BackdropTheme
            {
                Name = "Rustic Wooden Arch",
                Description = "Crafted wooden heptagon arch decorated with eucalyptus.",
                Style = "Bohemian",
                Dimensions = "7ft x 7ft",
                ImageUrl = "/images/backdrops/rustic.png",
                SetupComplexityInHours = 1,
                BasePrice = 200.00m,
                ItemType = "Backdrop"
            });

            context.BackdropThemes.Add(new BackdropTheme
            {
                Name = "Neon Glamour",
                Description = "Shimmering gold sequin backdrop featuring a neon sign.",
                Style = "Party",
                Dimensions = "8ft x 8ft",
                ImageUrl = "/images/backdrops/neon.png",
                SetupComplexityInHours = 1,
                BasePrice = 250.00m,
                ItemType = "Backdrop"
            });

            await context.SaveChangesAsync();
        }
    }
}
