using AutoMapper;
using thepartybackdropdiva.Application.DTOs;
using thepartybackdropdiva.Application.Interfaces;
using thepartybackdropdiva.Domain.Entities;
using thepartybackdropdiva.Infrastructure.Repositories;

namespace thepartybackdropdiva.Application.Services;

public class BackdropCollectionService : IBackdropCollectionService
{
    private readonly IBackdropCollectionRepository _collectionRepository;
    private readonly IRepository<BackdropImage> _imageRepository;
    private readonly IMapper _mapper;

    public BackdropCollectionService(
        IBackdropCollectionRepository collectionRepository,
        IRepository<BackdropImage> imageRepository,
        IMapper mapper)
    {
        _collectionRepository = collectionRepository;
        _imageRepository = imageRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BackdropCollectionDto>> GetAllCollectionsAsync()
    {
        var collections = await _collectionRepository.GetAllWithImagesAsync();
        return _mapper.Map<IEnumerable<BackdropCollectionDto>>(collections);
    }

    public async Task<BackdropCollectionDto?> GetCollectionByIdAsync(Guid id)
    {
        var collection = await _collectionRepository.GetByIdWithImagesAsync(id);
        return _mapper.Map<BackdropCollectionDto>(collection);
    }

    public async Task<BackdropCollectionDto> CreateCollectionAsync(BackdropCollectionDto dto)
    {
        var collection = _mapper.Map<BackdropCollection>(dto);
        await _collectionRepository.AddAsync(collection);
        return _mapper.Map<BackdropCollectionDto>(collection);
    }

    public async Task UpdateCollectionAsync(Guid id, BackdropCollectionDto dto)
    {
        var collection = await _collectionRepository.GetByIdAsync(id);
        if (collection == null) return;

        _mapper.Map(dto, collection);
        await _collectionRepository.UpdateAsync(collection);
    }

    public async Task DeleteCollectionAsync(Guid id)
    {
        var collection = await _collectionRepository.GetByIdAsync(id);
        if (collection != null)
        {
            await _collectionRepository.DeleteAsync(collection);
        }
    }

    public async Task<BackdropImageDto> AddImageAsync(Guid collectionId, BackdropImageDto dto)
    {
        var image = _mapper.Map<BackdropImage>(dto);
        image.BackdropCollectionId = collectionId;
        await _imageRepository.AddAsync(image);
        return _mapper.Map<BackdropImageDto>(image);
    }

    public async Task UpdateImageAsync(Guid collectionId, Guid imageId, BackdropImageDto dto)
    {
        var image = await _imageRepository.GetByIdAsync(imageId);
        if (image == null || image.BackdropCollectionId != collectionId) return;

        _mapper.Map(dto, image);
        await _imageRepository.UpdateAsync(image);
    }

    public async Task DeleteImageAsync(Guid collectionId, Guid imageId)
    {
        var image = await _imageRepository.GetByIdAsync(imageId);
        if (image != null && image.BackdropCollectionId == collectionId)
        {
            await _imageRepository.DeleteAsync(image);
        }
    }
}
