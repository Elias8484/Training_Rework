using Backend.Services;
using Supabase;
using Google.Cloud.Storage.V1;

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

var bucket = builder.Configuration["GoogleCloud:BucketName"] ?? throw new Exception("key (bucket name) is missing!");
var credsPath = builder.Configuration["GoogleCloud:CredentialsPath"] ?? throw new Exception("google cloud gcs file with credentials is missing!");

var storageClient = new StorageClientBuilder

{
    CredentialsPath = credsPath
}.Build();

builder.Services.AddSingleton(storageClient);
builder.Services.AddSingleton(bucket);

builder.Services.AddScoped(_ => 
    new Supabase.Client(supabaseUrl, supabaseKey, new SupabaseOptions
    {
        AutoRefreshToken = true,
        AutoConnectRealtime = true
    })
);

var app = builder.Build();

Console.WriteLine($"ENV: {app.Environment.EnvironmentName}");
Console.WriteLine($"GCS_BUCKET_NAME = '{bucket}'");
Console.WriteLine($"GCS_Creds= '{credsPath}'");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("DevCors");

app.MapControllers();

app.Run();
