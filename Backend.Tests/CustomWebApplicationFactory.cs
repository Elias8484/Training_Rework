using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration((context, config) =>
        {
            var overrides = new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "test-secret-key-that-is-at-least-32-characters-long",
                ["Jwt:Issuer"] = "test-issuer",
                ["Jwt:Audience"] = "test-audience",
            };

            var testConnStr = Environment.GetEnvironmentVariable("TEST_DB_CONNECTION_STRING");
            if (testConnStr != null)
                overrides["ConnectionStrings:DefaultConnection"] = testConnStr;

            config.AddInMemoryCollection(overrides);
        });

        builder.UseEnvironment("Development");
    }
}
