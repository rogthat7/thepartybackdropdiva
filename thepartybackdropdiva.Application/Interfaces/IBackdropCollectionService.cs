using thepartybackdropdiva.Application.DTOs;

namespace thepartybackdropdiva.Application.Interfaces;

public interface IBackdropCollectionService
{
    Task<IEnumerable<BackdropCollectionDto>> GetAllCollectionsAsync();
    Task<BackdropCollectionDto?> GetCollectionByIdAsync(Guid id);
    Task<BackdropCollectionDto> CreateCollectionAsync(BackdropCollectionDto dto);
    Task UpdateCollectionAsync(Guid id, BackdropCollectionDto dto);
    Task DeleteCollectionAsync(Guid id);
    
    Task<BackdropImageDto> AddImageAsync(Guid collectionId, BackdropImageDto dto);
    Task UpdateImageAsync(Guid collectionId, Guid imageId, BackdropImageDto dto);
    Task DeleteImageAsync(Guid collectionId, Guid imageId);
}
