using Backend.Services;
using Supabase;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddNewtonsoftJson();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", p =>
        p.AllowAnyOrigin()
         .AllowAnyHeader()
         .AllowAnyMethod());
});

builder.Services.AddSingleton<CounterState>();

var supabaseUrl = builder.Configuration["Supabase:Url"] ?? throw new Exception("Supabase URL is missing!");
var supabaseKey = builder.Configuration["Supabase:Key"] ?? throw new Exception("Supabase Key is missing!");

builder.Services.AddScoped(_ => 
    new Supabase.Client(supabaseUrl, supabaseKey, new SupabaseOptions
    {
        AutoRefreshToken = true,
        AutoConnectRealtime = true
    })
);

var app = builder.Build();

Console.WriteLine($"ENV: {app.Environment.EnvironmentName}");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("DevCors");

app.MapControllers();

app.Run();
