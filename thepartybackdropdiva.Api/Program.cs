using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using thepartybackdropdiva.Application.Interfaces;
using thepartybackdropdiva.Application.Mappings;
using thepartybackdropdiva.Application.Services;
using thepartybackdropdiva.Domain.Entities;
using thepartybackdropdiva.Infrastructure.Data;
using thepartybackdropdiva.Infrastructure.Repositories;
using Scalar.AspNetCore;
using MediatR;

var builder = WebApplication.CreateBuilder(args);

// MediatR
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(thepartybackdropdiva.Application.Bookings.Queries.GetMemberEventsQuery).Assembly);
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
});

// Add services to the container.
builder.Services.Configure<thepartybackdropdiva.Communication.Models.EmailSettings>(
    builder.Configuration.GetSection("EmailSettings"));

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.ASCII.GetBytes(jwtSettings["Secret"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("MemberOnly", policy => policy.RequireRole("Admin", "Member"));
    options.AddPolicy("GuestOnly", policy => policy.RequireRole("Admin", "Member", "Guest"));
});

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
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<ICateringService, CateringService>();
builder.Services.AddScoped<IBackdropService, BackdropService>();
builder.Services.AddScoped<thepartybackdropdiva.Communication.Interfaces.ICommunicationService, thepartybackdropdiva.Communication.Services.CommunicationService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// .NET 10 Native OpenAPI
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer<thepartybackdropdiva.Api.Infrastructure.BearerSecuritySchemeTransformer>();
});

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
    app.MapOpenApi();
    app.MapScalarApiReference();
    
    // Redirect /swagger to /scalar/v1 to avoid 404 confusion
    app.MapGet("/swagger", () => Results.Redirect("/scalar/v1"));
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

try
{
    app.Run();
}
catch (Exception ex)
{
    Console.Error.WriteLine("FATAL ERROR DURING STARTUP:");
    Console.Error.WriteLine(ex.ToString());
    throw;
}
