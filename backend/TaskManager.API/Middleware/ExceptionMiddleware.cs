using System.Net;
using System.Text.Json;
using TaskManager.API.Exceptions;
using TaskManager.API.Models.DTOs;

namespace TaskManager.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var response = new ErrorResponse { Timestamp = DateTime.UtcNow };

            // Map exception type to HTTP status code
            (context.Response.StatusCode, response.StatusCode, response.Message) = exception switch
            {
                NotFoundException ex => (404, 404, ex.Message),
                UnauthorizedException ex => (401, 401, ex.Message),
                ForbiddenException ex => (403, 403, ex.Message),
                BadRequestException ex => (400, 400, ex.Message),
                ConflictException ex => (409, 409, ex.Message),
                _ => (500, 500, "An internal server error occurred.")
            };

            if (exception is not (NotFoundException or UnauthorizedException or 
                ForbiddenException or BadRequestException or ConflictException))
            {
                response.Details = exception.Message;
            }

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            await context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
        }
    }
}