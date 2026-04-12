using AutoMapper;
using thepartybackdropdiva.Application.DTOs;
using thepartybackdropdiva.Application.Interfaces;
using thepartybackdropdiva.Domain.Entities;
using thepartybackdropdiva.Infrastructure.Repositories;

namespace thepartybackdropdiva.Application.Services;

public class CateringService : ICateringService
{
    private readonly IRepository<CateringMenu> _menuRepository;
    private readonly IMapper _mapper;

    public CateringService(IRepository<CateringMenu> menuRepository, IMapper mapper)
    {
        _menuRepository = menuRepository;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<CateringMenuDto>> GetAllMenusAsync()
    {
        var menus = await _menuRepository.GetAllAsync();
        return _mapper.Map<IReadOnlyList<CateringMenuDto>>(menus);
    }
}
