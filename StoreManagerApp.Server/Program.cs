using Microsoft.EntityFrameworkCore;
using StoreManagerApp.Server.Data;
using StoreManagerApp.Server.Middleware;
using StoreManagerApp.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// EF Core
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// DI Services

builder.Services.AddScoped<ISaleService, SaleService>();

// ✅ CORS - ALLOW your deployed frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "https://storemanagerappserver1-ftexcbgcfne8fyc4.australiaeast-01.azurewebsites.net"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

// ✅ Apply CORS here
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");

// Optional DB init
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

Console.WriteLine("✅ Deployed with correct CORS!");

app.Run();
