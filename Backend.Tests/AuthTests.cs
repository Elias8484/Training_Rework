using System.Net;
using System.Net.Http.Json;
using Backend.Data;
using Microsoft.Extensions.DependencyInjection;

public class AuthTests : IClassFixture<CustomWebApplicationFactory>, IAsyncLifetime
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;
    private readonly List<string> _createdUsernames = new();

    public AuthTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    public Task InitializeAsync() => Task.CompletedTask;

    public async Task DisposeAsync()
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var testUsers = db.Users.Where(u => _createdUsernames.Contains(u.Username)).ToList();
        db.Users.RemoveRange(testUsers);
        await db.SaveChangesAsync();
    }

    private async Task<string> RegisterUser(string? username = null)
    {
        username ??= $"testuser_{Guid.NewGuid():N}";
        await _client.PostAsJsonAsync("/api/auth/register", new
        {
            fullName = "Test User",
            username,
            password = "TestPassword123"
        });
        _createdUsernames.Add(username);
        return username;
    }

    [Fact]
    public async Task Register_ReturnsOk_WithValidData()
    {
        var username = $"testuser_{Guid.NewGuid():N}";
        var res = await _client.PostAsJsonAsync("/api/auth/register", new
        {
            fullName = "Test User",
            username,
            password = "TestPassword123"
        });
        _createdUsernames.Add(username);

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var data = await res.Content.ReadFromJsonAsync<dynamic>();
        Assert.NotNull(data);
    }

    [Fact]
    public async Task Register_ReturnsConflict_WhenUsernameIsTaken()
    {
        var username = await RegisterUser();
        var res = await _client.PostAsJsonAsync("/api/auth/register", new
        {
            fullName = "Test User",
            username,
            password = "TestPassword123"
        });

        Assert.Equal(HttpStatusCode.Conflict, res.StatusCode);
    }

    [Fact]
    public async Task Login_ReturnsOk_WithValidCredentials()
    {
        var username = await RegisterUser();
        var res = await _client.PostAsJsonAsync("/api/auth/login", new
        {
            username,
            password = "TestPassword123"
        });

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
    }

    [Fact]
    public async Task Login_ReturnsUnauthorized_WithWrongPassword()
    {
        var username = await RegisterUser();
        var res = await _client.PostAsJsonAsync("/api/auth/login", new
        {
            username,
            password = "WrongPassword"
        });

        Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
    }
}
