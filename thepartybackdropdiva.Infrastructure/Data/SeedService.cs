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

        // Seeding Rustic Wooden Arch Collection
        var rusticArch = await context.BackdropCollections
            .Include(c => c.Images)
            .FirstOrDefaultAsync(c => c.Name == "Rustic Wooden Arch");

        if (rusticArch == null)
        {
            rusticArch = new BackdropCollection
            {
                Name = "Rustic Wooden Arch",
                Description = "Handcrafted wooden geometries decorated with various botanicals.",
                CoverImageUrl = "/images/rustic_wooden_arch_1.png"
            };
            context.BackdropCollections.Add(rusticArch);
            await context.SaveChangesAsync();
        }
        else
        {
            rusticArch.CoverImageUrl = "/images/rustic_wooden_arch_1.png";
        }

        var rusticImages = new List<(string Title, string ImageUrl, string[]? Additional)>
        {
            ("Elegant Greenery Arch", "/images/rustic_wooden_arch_1.png", null),
            ("Fairy Light Romance", "/images/rustic_wooden_arch_2.png", null),
            ("Golden Hour Barn Wood", "/images/rustic_wooden_arch_3.png", null),
            ("Blush Rose Geometry", "/images/rustic_wooden_arch_4.png", null),
            ("Birch Wood Chiffon", "/images/rustic_wooden_arch_5.png", null),
            ("Bohemian Macrame", "/images/rustic_wooden_arch_6.png", null)
        };

        foreach (var t in rusticImages)
        {
            var existingImg = rusticArch.Images?.FirstOrDefault(i => i.Title == t.Title);
            if (existingImg == null)
            {
                context.BackdropImages.Add(new BackdropImage 
                { 
                    Title = t.Title, 
                    ImageUrl = t.ImageUrl, 
                    AdditionalImageUrls = t.Additional, 
                    Collection = rusticArch 
                });
            }
            else
            {
                existingImg.ImageUrl = t.ImageUrl;
                existingImg.AdditionalImageUrls = t.Additional;
            }
        }

        // Seeding Neon Glamour Collection
        var neonGlamour = await context.BackdropCollections
            .Include(c => c.Images)
            .FirstOrDefaultAsync(c => c.Name == "Neon Glamour");

        if (neonGlamour == null)
        {
            neonGlamour = new BackdropCollection
            {
                Name = "Neon Glamour",
                Description = "High-energy sequin walls and vibrant neon statements covering all major social events.",
                CoverImageUrl = "/images/neon_glamour_1.png"
            };
            context.BackdropCollections.Add(neonGlamour);
            await context.SaveChangesAsync();
        }
        else
        {
            neonGlamour.CoverImageUrl = "/images/neon_glamour_1.png";
        }

        var neonImages = new List<(string Title, string ImageUrl, string[]? Additional)>
        {
            ("Modern Luxury Wedding 'Better Together'", "/images/neon_glamour_1.png", null),
            ("21st Birthday 'Happy Birthday' Pink", "/images/neon_glamour_2.png", null),
            ("Corporate Gala Geometric", "/images/neon_glamour_3.png", null),
            ("Bridal Shower 'Bride to Be'", "/images/neon_glamour_4.png", null),
            ("Anniversary Celebration 'Cheers'", "/images/neon_glamour_5.png", null),
            ("Baby Shower 'Oh Baby'", "/images/neon_glamour_6.png", null),
            ("New Year's Eve 'Let's Party'", "/images/neon_glamour_7.png", null),
            ("Prom Night 'Night to Remember'", "/images/neon_glamour_8.png", null)
        };

        foreach (var t in neonImages)
        {
            var existingImg = neonGlamour.Images?.FirstOrDefault(i => i.Title == t.Title);
            if (existingImg == null)
            {
                context.BackdropImages.Add(new BackdropImage 
                { 
                    Title = t.Title, 
                    ImageUrl = t.ImageUrl, 
                    AdditionalImageUrls = t.Additional, 
                    Collection = neonGlamour 
                });
            }
            else
            {
                existingImg.ImageUrl = t.ImageUrl;
                existingImg.AdditionalImageUrls = t.Additional;
            }
        }

        await context.SaveChangesAsync();


    }
}
