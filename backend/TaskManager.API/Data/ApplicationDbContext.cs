using Microsoft.EntityFrameworkCore;
using TaskManager.API.Models.Entities;
using TaskManager.API.Models.Enums;

namespace TaskManager.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Each DbSet = one table
        public DbSet<User> Users { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User table configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
                entity.HasIndex(u => u.Username).IsUnique();

                entity.Property(u => u.Role)
                    .HasConversion<string>()
                    .HasMaxLength(20);

                entity.Property(u => u.Id)
                    .HasColumnType("char(36)");
            });

            // TaskItem table configuration
            modelBuilder.Entity<TaskItem>(entity =>
            {
                entity.Property(t => t.Status)
                    .HasConversion<string>()
                    .HasMaxLength(20);

                entity.Property(t => t.Id).HasColumnType("char(36)");
                entity.Property(t => t.CreatedById).HasColumnType("char(36)");
                entity.Property(t => t.AssignedToId).HasColumnType("char(36)");

                // Relationships
                entity.HasOne(t => t.CreatedBy)
                    .WithMany(u => u.CreatedTasks)
                    .HasForeignKey(t => t.CreatedById)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(t => t.AssignedTo)
                    .WithMany(u => u.AssignedTasks)
                    .HasForeignKey(t => t.AssignedToId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasIndex(t => t.Status);
                entity.HasIndex(t => t.CreatedAt);
            });

            // Seed default admin user
            var adminId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = adminId,
                Username = "admin",
                Email = "admin@workplace.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                Role = UserRole.Admin,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        // Auto-update timestamps on save
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }

        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is TaskItem || e.Entity is User);

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Modified)
                {
                    if (entry.Entity is TaskItem task)
                        task.UpdatedAt = DateTime.UtcNow;
                    else if (entry.Entity is User user)
                        user.UpdatedAt = DateTime.UtcNow;
                }
            }
        }
    }
}