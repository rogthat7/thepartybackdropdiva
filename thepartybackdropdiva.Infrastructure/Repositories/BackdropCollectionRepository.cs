using Microsoft.EntityFrameworkCore;
using thepartybackdropdiva.Domain.Entities;
using thepartybackdropdiva.Infrastructure.Data;

namespace thepartybackdropdiva.Infrastructure.Repositories;

public class BackdropCollectionRepository : Repository<BackdropCollection>, IBackdropCollectionRepository
{
    public BackdropCollectionRepository(AppDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<IEnumerable<BackdropCollection>> GetAllWithImagesAsync()
    {
        return await _dbContext.BackdropCollections
            .Include(c => c.Images)
            .ToListAsync();
    }

    public async Task<BackdropCollection?> GetByIdWithImagesAsync(Guid id)
    {
        return await _dbContext.BackdropCollections
            .Include(c => c.Images)
            .FirstOrDefaultAsync(c => c.Id == id);
    }
}
