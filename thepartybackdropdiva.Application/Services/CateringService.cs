using Microsoft.EntityFrameworkCore;
using AutoMapper;
using thepartybackdropdiva.Application.DTOs;
using thepartybackdropdiva.Application.Interfaces;
using thepartybackdropdiva.Domain.Entities;
using thepartybackdropdiva.Infrastructure.Data;

namespace thepartybackdropdiva.Application.Services;

public class CateringService : ICateringService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public CateringService(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<CateringMenuDto>> GetAllMenusAsync()
    {
        var menus = await _context.CateringMenus
            .Include(m => m.MenuItems)
            .Where(m => !m.IsCustom) // Only return standard packages
            .ToListAsync();
            
        return _mapper.Map<IReadOnlyList<CateringMenuDto>>(menus);
    }

    public async Task<CateringMenuDto> CreateCustomMenuAsync(string name, Guid? userId, List<Guid> menuItemIds)
    {
        // Calculate price and build the items
        var items = await _context.MenuItems
            .Where(i => menuItemIds.Contains(i.Id))
            .ToListAsync();

        var basePrice = items.Sum(i => i.BasePrice);

        var customMenu = new CateringMenu
        {
            Name = name,
            Description = "Custom Package tailored for your event.",
            BasePricePerPlate = basePrice,
            IsCustom = true,
            UserId = userId,
        };
        
        // Clone items for the custom package to avoid EF tracking issues
        foreach (var item in items)
        {
            customMenu.MenuItems.Add(new MenuItem
            {
                Name = item.Name,
                Description = item.Description,
                Category = item.Category,
                BasePrice = item.BasePrice,
                IsVegetarian = item.IsVegetarian,
                IsGlutenFree = item.IsGlutenFree,
                ItemType = item.ItemType,
                ImageUrl = item.ImageUrl
            });
        }

        _context.CateringMenus.Add(customMenu);
        await _context.SaveChangesAsync();

        return _mapper.Map<CateringMenuDto>(customMenu);
    }
}
