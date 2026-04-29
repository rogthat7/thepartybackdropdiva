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

    public async Task<IReadOnlyList<MenuItemDto>> GetAllMenuItemsAsync()
    {
        var items = await _context.MenuItems.ToListAsync();
        return _mapper.Map<IReadOnlyList<MenuItemDto>>(items);
    }

    public async Task<MenuItemDto> CreateMenuItemAsync(MenuItemDto dto)
    {
        var item = _mapper.Map<MenuItem>(dto);
        item.Id = Guid.NewGuid();
        item.ItemType = "Menu"; // Ensure discriminator is set if needed (though EF handles it)

        _context.MenuItems.Add(item);
        await _context.SaveChangesAsync();

        return _mapper.Map<MenuItemDto>(item);
    }

    public async Task<MenuItemDto> UpdateMenuItemAsync(Guid id, MenuItemDto dto)
    {
        var item = await _context.MenuItems.FindAsync(id);
        if (item == null) throw new Exception("MenuItem not found.");

        _mapper.Map(dto, item);
        item.Id = id; // Ensure ID doesn't change

        await _context.SaveChangesAsync();
        return _mapper.Map<MenuItemDto>(item);
    }

    public async Task DeleteMenuItemAsync(Guid id)
    {
        var item = await _context.MenuItems.FindAsync(id);
        if (item != null)
        {
            _context.MenuItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<CateringMenuDto> CreateMenuAsync(CateringMenuDto dto)
    {
        var menu = _mapper.Map<CateringMenu>(dto);
        menu.Id = Guid.NewGuid();
        menu.IsCustom = false;
        
        // Handle menu items
        var itemIds = dto.MenuItems.Select(i => i.Id).ToList();
        menu.MenuItems = await _context.MenuItems.Where(i => itemIds.Contains(i.Id)).ToListAsync();

        _context.CateringMenus.Add(menu);
        await _context.SaveChangesAsync();

        return _mapper.Map<CateringMenuDto>(menu);
    }

    public async Task<CateringMenuDto> UpdateMenuAsync(Guid id, CateringMenuDto dto)
    {
        var menu = await _context.CateringMenus.Include(m => m.MenuItems).FirstOrDefaultAsync(m => m.Id == id);
        if (menu == null) throw new Exception("CateringMenu not found.");

        _mapper.Map(dto, menu);
        menu.Id = id;
        menu.IsCustom = false;

        // Update items relationship
        menu.MenuItems.Clear();
        var itemIds = dto.MenuItems.Select(i => i.Id).ToList();
        menu.MenuItems = await _context.MenuItems.Where(i => itemIds.Contains(i.Id)).ToListAsync();

        await _context.SaveChangesAsync();
        return _mapper.Map<CateringMenuDto>(menu);
    }

    public async Task DeleteMenuAsync(Guid id)
    {
        var menu = await _context.CateringMenus.FindAsync(id);
        if (menu != null)
        {
            _context.CateringMenus.Remove(menu);
            await _context.SaveChangesAsync();
        }
    }
}
