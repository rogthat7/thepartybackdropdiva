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

    public async Task<IReadOnlyList<CateringMenuDto>> GetAllMenusAsync(Guid? userId = null)
    {
        var query = _context.CateringMenus
            .Include(m => m.MenuItems)
            .AsQueryable();

        if (userId.HasValue)
        {
            // Return standard packages OR custom packages belonging to this user
            query = query.Where(m => !m.IsCustom || m.UserId == userId);
        }
        else
        {
            // For guests, only return standard packages
            // (Unless we want them to see their guest custom packages if we tracked them, 
            // but currently we only link to UserId)
            query = query.Where(m => !m.IsCustom);
        }

        var menus = await query.ToListAsync();
            
        return _mapper.Map<IReadOnlyList<CateringMenuDto>>(menus);
    }

    public async Task<CateringMenuDto> CreateCustomMenuAsync(string name, Guid? userId, List<Guid> menuItemIds)
    {
        var items = await _context.MenuItems
            .Where(i => menuItemIds.Contains(i.Id))
            .ToListAsync();

        var customMenu = new CateringMenu
        {
            Name = name,
            Description = "Custom Package tailored for your event.",
            BasePricePerPlate = items.Sum(i => i.BasePrice),
            IsCustom = true,
            UserId = userId,
            MenuItems = items
        };

        _context.CateringMenus.Add(customMenu);
        await _context.SaveChangesAsync();

        return _mapper.Map<CateringMenuDto>(customMenu);
    }

    public async Task<CateringMenuDto> UpdateCustomMenuAsync(Guid menuId, string name, Guid? userId, List<Guid> menuItemIds)
    {
        // Update the main menu properties directly
        await _context.CateringMenus
            .Where(m => m.Id == menuId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(m => m.Name, name)
                .SetProperty(m => m.UpdatedAt, DateTime.UtcNow));

        var customMenu = await _context.CateringMenus
            .Include(m => m.MenuItems)
            .FirstOrDefaultAsync(m => m.Id == menuId);

        if (customMenu == null || !customMenu.IsCustom)
        {
            throw new Exception("Custom menu not found or is not a custom menu.");
        }

        // Update items relationship
        customMenu.MenuItems.Clear();
        var items = await _context.MenuItems
            .Where(i => menuItemIds.Contains(i.Id))
            .ToListAsync();

        customMenu.BasePricePerPlate = items.Sum(i => i.BasePrice);
        foreach (var item in items)
        {
            customMenu.MenuItems.Add(item);
        }

        await _context.SaveChangesAsync();

        return _mapper.Map<CateringMenuDto>(customMenu);
    }

    public async Task DeleteCustomMenuAsync(Guid menuId, Guid? userId)
    {
        var customMenu = await _context.CateringMenus
            .FirstOrDefaultAsync(m => m.Id == menuId);

        if (customMenu == null || !customMenu.IsCustom)
        {
            return;
        }

        _context.CateringMenus.Remove(customMenu);
        await _context.SaveChangesAsync();
    }
}
