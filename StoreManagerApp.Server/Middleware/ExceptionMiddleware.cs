using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace StoreManagerApp.Server.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context); // Call the next middleware
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception occurred");

                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                context.Response.ContentType = "application/json";

                var response = _env.IsDevelopment()
                    ? new Dictionary<string, string?>
                    {
                        { "message", ex.Message },
                        { "stackTrace", ex.StackTrace }
                    }
                    : new Dictionary<string, string?>
                    {
                        { "message", "Internal server error" }
                    };

                var json = JsonSerializer.Serialize(response);
                await context.Response.WriteAsync(json);
            }
        }
    }
}
