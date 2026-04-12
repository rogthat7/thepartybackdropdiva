using thepartybackdropdiva.Application.DTOs;

namespace thepartybackdropdiva.Application.Interfaces;

public interface ICateringService
{
    Task<IReadOnlyList<CateringMenuDto>> GetAllMenusAsync();
}
