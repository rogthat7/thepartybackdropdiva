using thepartybackdropdiva.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace thepartybackdropdiva.Application.Interfaces;

public interface ICateringService
{
    Task<IReadOnlyList<CateringMenuDto>> GetAllMenusAsync(Guid? userId = null);
    Task<CateringMenuDto> CreateCustomMenuAsync(string name, Guid? userId, List<Guid> menuItemIds);
    Task<CateringMenuDto> UpdateCustomMenuAsync(Guid menuId, string name, Guid? userId, List<Guid> menuItemIds);
    Task DeleteCustomMenuAsync(Guid menuId, Guid? userId);
}
