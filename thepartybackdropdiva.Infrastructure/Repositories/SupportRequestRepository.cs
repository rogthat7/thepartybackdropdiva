using thepartybackdropdiva.Domain.Entities;
using thepartybackdropdiva.Infrastructure.Data;

namespace thepartybackdropdiva.Infrastructure.Repositories;

public class SupportRequestRepository : Repository<SupportRequest>, ISupportRequestRepository
{
    public SupportRequestRepository(AppDbContext dbContext) : base(dbContext)
    {
    }
}
