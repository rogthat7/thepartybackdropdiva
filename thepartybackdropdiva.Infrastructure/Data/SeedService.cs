using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using thepartybackdropdiva.Domain.Entities;

namespace thepartybackdropdiva.Infrastructure.Data;

public static class SeedService
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        var context = serviceProvider.GetRequiredService<AppDbContext>();
        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();

        await context.Database.MigrateAsync();

        // Seed Roles
        string[] roleNames = { "Admin", "Member", "Guest", "Support", "Advisor" };
        foreach (var roleName in roleNames)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(roleName));
            }
        }

        // Seed Admin User
        var adminEmail = "admin@thepartybackdropdiva.com";
        if (await userManager.FindByEmailAsync(adminEmail) == null)
        {
            var adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FirstName = "Admin",
                LastName = "User",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(adminUser, "Admin@123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }

        // Seed Support User
        var supportEmail = "support@thepartybackdropdiva.com";
        if (await userManager.FindByEmailAsync(supportEmail) == null)
        {
            var supportUser = new ApplicationUser
            {
                UserName = supportEmail,
                Email = supportEmail,
                FirstName = "Support",
                LastName = "Staff",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(supportUser, "Support@123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(supportUser, "Support");
            }
        }

        // Seed Advisor User
        var advisorEmail = "consultant@thepartybackdropdiva.com";
        if (await userManager.FindByEmailAsync(advisorEmail) == null)
        {
            var advisorUser = new ApplicationUser
            {
                UserName = advisorEmail,
                Email = advisorEmail,
                FirstName = "Expert",
                LastName = "Consultant",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(advisorUser, "Advisor@123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(advisorUser, "Advisor");
                
                // Create Advisor Entity
                if (!await context.Advisors.AnyAsync(a => a.UserId == advisorUser.Id))
                {
                    context.Advisors.Add(new Advisor
                    {
                        UserId = advisorUser.Id,
                        Specialization = "Event Backdrops & Themes",
                        IsActive = true
                    });
                    await context.SaveChangesAsync();
                }
            }
        }

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

        // Seeding Backdrop Collections with Synchronization
        var existingFloral = await context.BackdropCollections
            .Include(c => c.Images)
            .FirstOrDefaultAsync(c => c.Name == "Classic Floral Series");

        if (existingFloral == null)
        {
            existingFloral = new BackdropCollection
            {
                Name = "Classic Floral Series",
                Description = "Our signature curated selection of 10 unique, high-resolution floral backdrops.",
                CoverImageUrl = "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=800"
            };
            context.BackdropCollections.Add(existingFloral);
            await context.SaveChangesAsync();
        }
        else
        {
            // Sync properties
            existingFloral.Description = "Our signature curated selection of 10 unique, high-resolution floral backdrops.";
            existingFloral.CoverImageUrl = "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=800";
        }

        // Define the target images for the floral series
        var targetImages = new List<(string Title, string ImageUrl, string[]? Additional)>
        {
            ("Victorian Rose Garden", "/images/backdrops/generated/victorian_rose.png", null),
            ("Cherry Blossom Serenity", "/images/backdrops/generated/cherry_blossom.png", null),
            ("Wildflower Meadow", "/images/backdrops/generated/wildflower_meadow.png", null),
            ("Tropical Orchid Paradise", "/images/backdrops/generated/tropical_orchid.png", null),
            ("English Cottage Lavender", "/images/backdrops/generated/english_cottage.png", null),
            ("Golden Autumn Dahlia", "/images/backdrops/generated/golden_autumn.png", null),
            ("Whispering White Lily", "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200", null),
            ("Desert Bloom", "/images/backdrops/generated/desert_bloom.png", new[] {
                "https://images.unsplash.com/photo-1469533778471-92a68acc3633?auto=format&fit=crop&q=80&w=1200",
                "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200",
                "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=1200"
            }),
            ("Midnight Garden Wisteria", "/images/backdrops/generated/midnight_wisteria.png", null),
            ("Springtime Tulip Burst", "https://images.unsplash.com/photo-1520302830754-8d1a10389382?auto=format&fit=crop&q=80&w=1200", null)
        };

        foreach (var t in targetImages)
        {
            var existingImg = existingFloral.Images?.FirstOrDefault(i => i.Title == t.Title);
            if (existingImg == null)
            {
                context.BackdropImages.Add(new BackdropImage 
                { 
                    Title = t.Title, 
                    ImageUrl = t.ImageUrl, 
                    AdditionalImageUrls = t.Additional, 
                    Collection = existingFloral 
                });
            }
            else
            {
                existingImg.ImageUrl = t.ImageUrl;
                existingImg.AdditionalImageUrls = t.Additional;
            }
        }

        // Add other collections as placeholders if they don't exist
        if (!await context.BackdropCollections.AnyAsync(c => c.Name == "Rustic Wooden Arch"))
        {
            context.BackdropCollections.Add(new BackdropCollection
            {
                Name = "Rustic Wooden Arch",
                Description = "Handcrafted wooden geometries decorated with various botanicals.",
                CoverImageUrl = "https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&q=80&w=800"
            });
        }

        if (!await context.BackdropCollections.AnyAsync(c => c.Name == "Neon Glamour"))
        {
            context.BackdropCollections.Add(new BackdropCollection
            {
                Name = "Neon Glamour",
                Description = "High-energy sequin walls and vibrant neon statements.",
                CoverImageUrl = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800"
            });
        }

        await context.SaveChangesAsync();


    }
}
