using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<SaveImage> SaveImages { get; set; }
    public DbSet<Exercise> Exercises { get; set; }

    public DbSet<Workout> Workouts { get; set; }

    public DbSet<WorkoutEntry> WorkoutEntries { get; set; }

    public DbSet<Set> Sets { get; set; }

    public DbSet<Models.Program> Programs { get; set; }

    public DbSet<ProgramEntry> ProgramEntries { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().Property(u => u.Id).HasColumnName("user_id");
        modelBuilder.Entity<SaveImage>().Property(s => s.Id).HasColumnName("id");
        modelBuilder.Entity<Exercise>().Property(s => s.Id).HasColumnName("exercise_id");
        modelBuilder.Entity<Workout>().Property(s => s.Id).HasColumnName("workout_id");
        modelBuilder.Entity<WorkoutEntry>().Property(s => s.Id).HasColumnName("workout_entry_id");
        modelBuilder.Entity<Set>().Property(s => s.Id).HasColumnName("set_id");
        modelBuilder.Entity<Models.Program>().Property(s => s.Id).HasColumnName("program_id");
        modelBuilder.Entity<ProgramEntry>().Property(s => s.Id).HasColumnName("program_entry_id");
    }
}