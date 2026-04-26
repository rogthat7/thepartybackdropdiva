using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace thepartybackdropdiva.Infrastructure.Data;

public class PostgresAppDbContextFactory : IDesignTimeDbContextFactory<PostgresAppDbContext>
{
    public PostgresAppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<PostgresAppDbContext>();
        optionsBuilder.UseNpgsql(
            "Host=localhost;Database=thepartybackdropdiva;Username=postgres;Password=YourStrongPassword123!",
            x => x.MigrationsAssembly("thepartybackdropdiva.Infrastructure")
                   .MigrationsHistoryTable("__EFMigrationsHistory"));

        return new PostgresAppDbContext(optionsBuilder.Options);
    }
}
