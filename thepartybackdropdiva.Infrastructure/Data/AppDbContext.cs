using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using thepartybackdropdiva.Domain.Entities;

namespace thepartybackdropdiva.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions options) : base(options)
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Vendor> Vendors { get; set; } = null!;
    public DbSet<ServiceItem> ServiceItems { get; set; } = null!;
    public DbSet<MenuItem> MenuItems { get; set; } = null!;
    public DbSet<BackdropTheme> BackdropThemes { get; set; } = null!;
    public DbSet<CateringMenu> CateringMenus { get; set; } = null!;
    public DbSet<Booking> Bookings { get; set; } = null!;
    public DbSet<Invoice> Invoices { get; set; } = null!;
    public DbSet<Payment> Payments { get; set; } = null!;
    public DbSet<ConsultationRequest> ConsultationRequests { get; set; } = null!;
    public DbSet<FollowUp> FollowUps { get; set; } = null!;
    public DbSet<SupportRequest> SupportRequests { get; set; } = null!;
    public DbSet<Advisor> Advisors { get; set; } = null!;
    public DbSet<AdvisorActiveConsultation> AdvisorActiveConsultations { get; set; } = null!;
    public DbSet<BackdropCollection> BackdropCollections { get; set; } = null!;
    public DbSet<BackdropImage> BackdropImages { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Table Per Hierarchy (TPH) is automatically configured for ServiceItem -> MenuItem, BackdropTheme.
        // We can explicitly configure it if desired.
        modelBuilder.Entity<ServiceItem>()
            .HasDiscriminator<string>("ItemType")
            .HasValue<ServiceItem>("Base")
            .HasValue<MenuItem>("Menu")
            .HasValue<BackdropTheme>("Backdrop");

        // Booking to Invoice is 1-to-0..1
        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Invoice)
            .WithOne(i => i.Booking)
            .HasForeignKey<Invoice>(i => i.BookingId);

        // Booking to FollowUps is 1-to-many
        modelBuilder.Entity<FollowUp>()
            .HasOne(f => f.Booking)
            .WithMany(b => b.FollowUps)
            .HasForeignKey(f => f.BookingId)
            .OnDelete(DeleteBehavior.Cascade);

        // ConsultationRequest to FollowUps is 1-to-many
        modelBuilder.Entity<FollowUp>()
            .HasOne(f => f.ConsultationRequest)
            .WithMany()
            .HasForeignKey(f => f.ConsultationRequestId)
            .OnDelete(DeleteBehavior.SetNull);

        // Advisor assignments
        modelBuilder.Entity<AdvisorActiveConsultation>()
            .HasOne(ac => ac.Advisor)
            .WithMany(a => a.ActiveConsultations)
            .HasForeignKey(ac => ac.AdvisorId);

        modelBuilder.Entity<AdvisorActiveConsultation>()
            .HasOne(ac => ac.ConsultationRequest)
            .WithMany()
            .HasForeignKey(ac => ac.ConsultationRequestId);


        // Configure precision for decimals
        var decimals = modelBuilder.Model.GetEntityTypes()
            .SelectMany(t => t.GetProperties())
            .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?));
            
        foreach (var property in decimals)
        {
            property.SetPrecision(18);
            property.SetScale(2);
        }
    }
    
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
            }
        }
        return base.SaveChangesAsync(cancellationToken);
    }
}
