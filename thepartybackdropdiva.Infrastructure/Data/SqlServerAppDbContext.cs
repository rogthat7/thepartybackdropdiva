using Microsoft.EntityFrameworkCore;

namespace thepartybackdropdiva.Infrastructure.Data;

public class SqlServerAppDbContext : AppDbContext
{
    public SqlServerAppDbContext(DbContextOptions<SqlServerAppDbContext> options) : base(options)
    {
    }
}
