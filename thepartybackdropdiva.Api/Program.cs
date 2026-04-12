using Microsoft.EntityFrameworkCore;
using thepartybackdropdiva.Application.Interfaces;
using thepartybackdropdiva.Application.Mappings;
using thepartybackdropdiva.Application.Services;
using thepartybackdropdiva.Infrastructure.Data;
using thepartybackdropdiva.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Infrastructure
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var isDocker = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";
var provider = Environment.GetEnvironmentVariable("DatabaseProvider") ?? (isDocker ? "Postgres" : "SqlServer");


if (provider == "Postgres")
{
    builder.Services.AddDbContext<PostgresAppDbContext>(options =>
        options.UseNpgsql(connectionString, x => x.MigrationsAssembly("thepartybackdropdiva.Infrastructure")));
    builder.Services.AddScoped<AppDbContext>(provider => provider.GetRequiredService<PostgresAppDbContext>());
}
else
{
    builder.Services.AddDbContext<SqlServerAppDbContext>(options =>
        options.UseSqlServer(connectionString, x => x.MigrationsAssembly("thepartybackdropdiva.Infrastructure")));
    builder.Services.AddScoped<AppDbContext>(provider => provider.GetRequiredService<SqlServerAppDbContext>());
}

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// Application
builder.Services.AddAutoMapper(config => { config.AddProfile<MappingProfile>(); });
builder.Services.AddTransient<IPricingEngine, PricingEngine>();
builder.Services.AddScoped<ICateringService, CateringService>();
builder.Services.AddScoped<IBackdropService, BackdropService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        b => b.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

// Seed Database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await SeedService.InitializeAsync(services);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
