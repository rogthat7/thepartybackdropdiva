using thepartybackdropdiva.Domain.Entities;

namespace thepartybackdropdiva.Infrastructure.Repositories;

public interface IBackdropCollectionRepository : IRepository<BackdropCollection>
{
    Task<IEnumerable<BackdropCollection>> GetAllWithImagesAsync();
    Task<BackdropCollection?> GetByIdWithImagesAsync(Guid id);
}
