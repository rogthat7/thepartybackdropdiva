using thepartybackdropdiva.Domain.Entities;
using thepartybackdropdiva.Infrastructure.Data;

namespace thepartybackdropdiva.Infrastructure.Repositories;

public class ConsultationRequestRepository : Repository<ConsultationRequest>, IConsultationRequestRepository
{
    public ConsultationRequestRepository(AppDbContext dbContext) : base(dbContext)
    {
    }
}
