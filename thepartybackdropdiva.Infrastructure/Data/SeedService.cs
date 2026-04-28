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

        // In Development, if we have menus but NO items linked (due to migration), re-seed.
        var hasLinkedItems = await context.CateringMenus.Include(m => m.MenuItems).AnyAsync(m => m.MenuItems.Any());
        if (!hasLinkedItems)
        {
            // Clear existing orphaned data to avoid duplicates
            context.MenuItems.RemoveRange(context.MenuItems);
            context.CateringMenus.RemoveRange(context.CateringMenus);
            await context.SaveChangesAsync();
        }

        if (!await context.CateringMenus.AnyAsync())
        {
            var silverPackage = new CateringMenu
            {
                Name = "Silver Package",
                Description = "A refined 3-course selection featuring our most popular classic dishes.",
                BasePricePerPlate = 45.00m
            };

            var goldPackage = new CateringMenu
            {
                Name = "Gold Package",
                Description = "Our premium catering package with a wider variety of gourmet options.",
                BasePricePerPlate = 75.00m
            };

            var platinumPackage = new CateringMenu
            {
                Name = "Platinum Package",
                Description = "The ultimate luxury dining experience featuring Wagyu, Truffle, and Seafood.",
                BasePricePerPlate = 125.00m
            };

            context.CateringMenus.AddRange(silverPackage, goldPackage, platinumPackage);

            // Starters
            var caprese = new MenuItem { Name = "Mini Caprese Skewers", Description = "Bite-sized cherry tomatoes, mozzarella, and basil drizzled with balsamic.", Category = "Starters", BasePrice = 8.00m, IsVegetarian = true, IsGlutenFree = true, ItemType = "Menu", ImageUrl = "/images/catering/generated/starter_caprese.png" };
            var bruschetta = new MenuItem { Name = "Bruschetta", Description = "Crispy toasted baguette slices topped with fresh diced tomatoes, garlic, and basil.", Category = "Starters", BasePrice = 9.00m, IsVegetarian = true, IsGlutenFree = false, ItemType = "Menu", ImageUrl = "/images/catering/generated/starter_bruschetta.png" };
            var arancini = new MenuItem { Name = "Truffle Arancini", Description = "Golden crispy risotto balls filled with melted cheese, served with a rich truffle aioli dip.", Category = "Starters", BasePrice = 12.00m, IsVegetarian = true, IsGlutenFree = false, ItemType = "Menu", ImageUrl = "/images/catering/generated/starter_arancini.png" };
            var crabcakes = new MenuItem { Name = "Crab Cakes", Description = "Golden brown lump crab cakes with a dollop of remoulade sauce and fresh lemon wedges.", Category = "Starters", BasePrice = 15.00m, IsVegetarian = false, IsGlutenFree = false, ItemType = "Menu", ImageUrl = "/images/catering/generated/starter_crabcakes.png" };
            var scallops = new MenuItem { Name = "Seared Scallops", Description = "Perfectly seared sea scallops with a golden crust, garnished with microgreens.", Category = "Starters", BasePrice = 18.00m, IsVegetarian = false, IsGlutenFree = true, ItemType = "Menu", ImageUrl = "/images/catering/generated/starter_scallops.png" };
            var sliders = new MenuItem { Name = "Wagyu Beef Sliders", Description = "Gourmet miniature burgers with brioche buns, melted cheese, and fresh greens.", Category = "Starters", BasePrice = 16.00m, IsVegetarian = false, IsGlutenFree = false, ItemType = "Menu", ImageUrl = "/images/catering/generated/starter_sliders.png" };

            // Mains
            var risotto = new MenuItem { Name = "Truffle Risotto", Description = "Creamy arborio rice infused with wild mushrooms, garnished with fresh parmesan.", Category = "Mains", BasePrice = 22.00m, IsVegetarian = true, IsGlutenFree = true, ItemType = "Menu", ImageUrl = "/images/catering/generated/main_risotto.png" };
            var salmon = new MenuItem { Name = "Herb-Crusted Salmon", Description = "Perfectly pan-seared salmon fillet with crispy herb crust, served with roasted asparagus.", Category = "Mains", BasePrice = 28.00m, IsVegetarian = false, IsGlutenFree = true, ItemType = "Menu", ImageUrl = "/images/catering/generated/main_salmon.png" };
            var wellington = new MenuItem { Name = "Vegan Mushroom Wellington", Description = "Flaky golden puff pastry encasing a savory mushroom duxelles.", Category = "Mains", BasePrice = 26.00m, IsVegetarian = true, IsGlutenFree = false, ItemType = "Menu", ImageUrl = "/images/catering/generated/main_wellington.png" };
            var lamb = new MenuItem { Name = "Roasted Lamb Rack", Description = "Beautifully carved rack of lamb with a fresh mint herb crust and root vegetables.", Category = "Mains", BasePrice = 35.00m, IsVegetarian = false, IsGlutenFree = true, ItemType = "Menu", ImageUrl = "/images/catering/generated/main_lambrack.png" };
            var blackcod = new MenuItem { Name = "Miso Glazed Black Cod", Description = "Flaky, melt-in-your-mouth black cod fillet with a caramelized miso glaze.", Category = "Mains", BasePrice = 38.00m, IsVegetarian = false, IsGlutenFree = true, ItemType = "Menu", ImageUrl = "/images/catering/generated/main_blackcod.png" };
            var filetmignon = new MenuItem { Name = "Filet Mignon", Description = "Perfectly cooked medium-rare beef tenderloin steak, served with red wine demi-glace.", Category = "Mains", BasePrice = 45.00m, IsVegetarian = false, IsGlutenFree = true, ItemType = "Menu", ImageUrl = "/images/catering/generated/main_filetmignon.png" };

            // Desserts
            var lemontart = new MenuItem { Name = "Lemon Tart", Description = "Zesty lemon curd in a buttery crust, topped with perfectly torched Italian meringue.", Category = "Desserts", BasePrice = 10.00m, IsVegetarian = true, IsGlutenFree = false, ItemType = "Menu", ImageUrl = "/images/catering/generated/dessert_lemontart.png" };
            var pannacotta = new MenuItem { Name = "Vanilla Panna Cotta", Description = "Silky vanilla bean panna cotta topped with a vibrant mixed berry compote.", Category = "Desserts", BasePrice = 11.00m, IsVegetarian = true, IsGlutenFree = true, ItemType = "Menu", ImageUrl = "/images/catering/generated/dessert_pannacotta.png" };
            var tiramisu = new MenuItem { Name = "Classic Tiramisu", Description = "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.", Category = "Desserts", BasePrice = 12.00m, IsVegetarian = true, IsGlutenFree = false, ItemType = "Menu", ImageUrl = "/images/catering/generated/dessert_tiramisu.png" };
            var cheesecake = new MenuItem { Name = "Berry Cheesecake", Description = "Creamy New York style cheesecake generously topped with fresh strawberries and blueberries.", Category = "Desserts", BasePrice = 12.00m, IsVegetarian = true, IsGlutenFree = false, ItemType = "Menu", ImageUrl = "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800" };
            var cremebrulee = new MenuItem { Name = "Crème Brûlée", Description = "Classic French vanilla custard with a perfectly caramelized hard sugar crust.", Category = "Desserts", BasePrice = 14.00m, IsVegetarian = true, IsGlutenFree = true, ItemType = "Menu", ImageUrl = "/images/catering/generated/dessert_cremebrulee.png" };
            var lavacake = new MenuItem { Name = "Chocolate Lava Cake", Description = "Decadent dark chocolate molten cake with a warm gooey center and vanilla bean ice cream.", Category = "Desserts", BasePrice = 15.00m, IsVegetarian = true, IsGlutenFree = false, ItemType = "Menu", ImageUrl = "/images/catering/generated/dessert_lavacake.png" };

            // Wait! Platinum should include Gold & Silver items. Gold should include Silver items.
            // Let's add them accordingly.
            var allItems = new List<MenuItem> { caprese, bruschetta, arancini, crabcakes, scallops, sliders, risotto, salmon, wellington, lamb, blackcod, filetmignon, lemontart, pannacotta, tiramisu, cheesecake, cremebrulee, lavacake };
            
            // Add to Silver (2 of each)
            silverPackage.MenuItems.Add(caprese);
            silverPackage.MenuItems.Add(bruschetta);
            silverPackage.MenuItems.Add(risotto);
            silverPackage.MenuItems.Add(salmon);
            silverPackage.MenuItems.Add(lemontart);
            silverPackage.MenuItems.Add(pannacotta);

            // Add to Gold (Silver + Gold items)
            goldPackage.MenuItems.Add(caprese);
            goldPackage.MenuItems.Add(bruschetta);
            goldPackage.MenuItems.Add(risotto);
            goldPackage.MenuItems.Add(salmon);
            goldPackage.MenuItems.Add(lemontart);
            goldPackage.MenuItems.Add(pannacotta);
            
            goldPackage.MenuItems.Add(arancini);
            goldPackage.MenuItems.Add(crabcakes);
            goldPackage.MenuItems.Add(wellington);
            goldPackage.MenuItems.Add(lamb);
            goldPackage.MenuItems.Add(tiramisu);
            goldPackage.MenuItems.Add(cheesecake);

            // Add to Platinum (Silver + Gold + Platinum items)
            platinumPackage.MenuItems.Add(caprese);
            platinumPackage.MenuItems.Add(bruschetta);
            platinumPackage.MenuItems.Add(risotto);
            platinumPackage.MenuItems.Add(salmon);
            platinumPackage.MenuItems.Add(lemontart);
            platinumPackage.MenuItems.Add(pannacotta);
            
            platinumPackage.MenuItems.Add(arancini);
            platinumPackage.MenuItems.Add(crabcakes);
            platinumPackage.MenuItems.Add(wellington);
            platinumPackage.MenuItems.Add(lamb);
            platinumPackage.MenuItems.Add(tiramisu);
            platinumPackage.MenuItems.Add(cheesecake);

            platinumPackage.MenuItems.Add(scallops);
            platinumPackage.MenuItems.Add(sliders);
            platinumPackage.MenuItems.Add(blackcod);
            platinumPackage.MenuItems.Add(filetmignon);
            platinumPackage.MenuItems.Add(cremebrulee);
            platinumPackage.MenuItems.Add(lavacake);

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
            ("Springtime Tulip Burst", "/images/backdrops/generated/springtime_tulip_burst.png", null)
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

    private static MenuItem CloneMenuItem(MenuItem item)
    {
        return new MenuItem
        {
            Name = item.Name,
            Description = item.Description,
            Category = item.Category,
            BasePrice = item.BasePrice,
            IsVegetarian = item.IsVegetarian,
            IsGlutenFree = item.IsGlutenFree,
            ItemType = item.ItemType,
            ImageUrl = item.ImageUrl
        };
    }
}
