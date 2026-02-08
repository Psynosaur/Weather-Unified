using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Linq;

namespace WURequest.Middleware
{
    /// <summary>
    /// Middleware to validate API key for non-SignalR requests
    /// Protects against direct curl/Postman access while allowing browser CORS requests
    /// </summary>
    public class ApiKeyAuthMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;
        private readonly ILogger<ApiKeyAuthMiddleware> _logger;
        private const string API_KEY_HEADER = "X-API-Key";

        public ApiKeyAuthMiddleware(RequestDelegate next, IConfiguration configuration, ILogger<ApiKeyAuthMiddleware> logger)
        {
            _next = next;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var path = context.Request.Path.Value;
            var origin = context.Request.Headers["Origin"].FirstOrDefault();
            var apiKey = context.Request.Headers[API_KEY_HEADER].FirstOrDefault();
            
            _logger.LogInformation($"🔐 API Auth Check: Path={path}, Origin={origin ?? "null"}, HasApiKey={!string.IsNullOrEmpty(apiKey)}");

            // Allow SignalR negotiation and WebSocket connections (browser-based)
            if (context.Request.Path.StartsWithSegments("/weatherhub"))
            {
                _logger.LogInformation("✅ Allowed: SignalR endpoint");
                await _next(context);
                return;
            }

            // Allow Meteobridge GET endpoint (internal device)
            if (context.Request.Path.StartsWithSegments("/api/weather/Mb"))
            {
                _logger.LogInformation("✅ Allowed: Meteobridge endpoint");
                await _next(context);
                return;
            }

            // Allow requests with valid Origin header (browser-based CORS requests)
            // Read allowed origins from configuration to match CORS policy
            var allowedOriginsConfig = _configuration.GetSection("CorsSettings:AllowedOrigins").Get<string[]>();
            
            // Fallback to hardcoded list if not in config
            var allowedOrigins = allowedOriginsConfig ?? new[]
            {
                "https://weatheru.co.za",            // Legacy site
                "https://new.weatheru.co.za",        // New Nuxt site
                "http://localhost:3000",
                "http://localhost:3001",
                "https://localhost:3000",
                "http://127.0.0.1:3000",
                "http://192.168.1.107:3000",
                "http://192.168.1.107:3001"
            };

            if (!string.IsNullOrEmpty(origin) && allowedOrigins.Contains(origin))
            {
                _logger.LogInformation($"✅ Allowed: Valid Origin header ({origin})");
                // Browser-based request from allowed origin - allow it
                await _next(context);
                return;
            }

            // For non-browser requests (curl, Postman, etc.), require API key
            var providedApiKey = context.Request.Headers[API_KEY_HEADER].FirstOrDefault();
            var validApiKey = _configuration["ApiSettings:ApiKey"];

            if (string.IsNullOrEmpty(validApiKey))
            {
                _logger.LogWarning("⚠️ No API key configured - allowing request (backward compatibility)");
                // If no API key is configured, allow the request (backward compatibility)
                await _next(context);
                return;
            }

            if (string.IsNullOrEmpty(providedApiKey) || providedApiKey != validApiKey)
            {
                _logger.LogWarning($"❌ Unauthorized: Invalid or missing API key for {path}");
                // Invalid or missing API key for non-browser request
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Unauthorized: Invalid or missing API key");
                return;
            }

            _logger.LogInformation("✅ Allowed: Valid API key");
            // Valid API key - proceed
            await _next(context);
        }
    }
}
