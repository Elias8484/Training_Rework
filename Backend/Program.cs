using Backend.Services;
using Backend.Data;
using Google.Cloud.Storage.V1;
using Microsoft.EntityFrameworkCore;

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


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new Exception("Connection string is missing!");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

var bucket = builder.Configuration["GoogleCloud:BucketName"] ?? throw new Exception("key (bucket name) is missing!");
var credsPath = builder.Configuration["GoogleCloud:CredentialsPath"] ?? throw new Exception("google cloud gcs file with credentials is missing!");

var storageClient = new StorageClientBuilder

{
    CredentialsPath = credsPath
}.Build();

builder.Services.AddSingleton(storageClient);
builder.Services.AddSingleton(bucket);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("DevCors");

app.MapControllers();

app.Run();
