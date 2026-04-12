using thepartybackdropdiva.Application.DTOs;

namespace thepartybackdropdiva.Application.Interfaces;

public interface IBackdropService
{
    Task<IReadOnlyList<BackdropThemeDto>> GetCatalogAsync();
}
