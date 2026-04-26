using thepartybackdropdiva.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace thepartybackdropdiva.Application.Interfaces;

public interface ICateringService
{
    Task<IReadOnlyList<CateringMenuDto>> GetAllMenusAsync();
    Task<CateringMenuDto> CreateCustomMenuAsync(string name, Guid? userId, List<Guid> menuItemIds);
}
