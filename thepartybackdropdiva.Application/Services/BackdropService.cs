using AutoMapper;
using thepartybackdropdiva.Application.DTOs;
using thepartybackdropdiva.Application.Interfaces;
using thepartybackdropdiva.Domain.Entities;
using thepartybackdropdiva.Infrastructure.Repositories;

namespace thepartybackdropdiva.Application.Services;

public class BackdropService : IBackdropService
{
    private readonly IRepository<BackdropTheme> _backdropRepository;
    private readonly IMapper _mapper;

    public BackdropService(IRepository<BackdropTheme> backdropRepository, IMapper mapper)
    {
        _backdropRepository = backdropRepository;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<BackdropThemeDto>> GetCatalogAsync()
    {
        var backdrops = await _backdropRepository.GetAllAsync();
        return _mapper.Map<IReadOnlyList<BackdropThemeDto>>(backdrops);
    }
}
