using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Todo> Todos { get; set; }
    public DbSet<SaveImage> SaveImages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().Property(u => u.Id).HasColumnName("user_id");
        modelBuilder.Entity<Todo>().Property(t => t.Id).HasColumnName("id");
        modelBuilder.Entity<SaveImage>().Property(s => s.Id).HasColumnName("id");
    }
}