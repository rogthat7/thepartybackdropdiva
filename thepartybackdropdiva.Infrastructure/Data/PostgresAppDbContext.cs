using Microsoft.EntityFrameworkCore;

namespace thepartybackdropdiva.Infrastructure.Data;

public class PostgresAppDbContext : AppDbContext
{
    public PostgresAppDbContext(DbContextOptions<PostgresAppDbContext> options) : base(options)
    {
    }
}
