using Microsoft.EntityFrameworkCore;
using StoreManagerApp.Server.Data;
using StoreManagerApp.Server.Services;
using StoreManagerApp.Server.Services.Implementations;
using StoreManagerApp.Server.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// ✅ Register SQL Server DB context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ Register dependency injection services
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IStoreService, StoreService>();
builder.Services.AddScoped<ISaleService, SaleService>();

// ✅ Add Controllers
builder.Services.AddControllers();

// ✅ Enable CORS (both local dev and deployed frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "https://localhost:4173", // ✅ Vite dev server
            "https://storemanagerappclient20250710.azurestaticapps.net" // ✅ Replace with your real frontend Azure URL
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

// ✅ Swagger/OpenAPI for dev
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ✅ Enable Swagger in development only
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ✅ Middleware pipeline
app.UseHttpsRedirection();

// ✅ Apply CORS before routing
app.UseCors("AllowFrontend");

app.UseAuthorization();

// ✅ Static files & fallback routing (for React SPA support if co-hosted)
app.UseDefaultFiles();
app.UseStaticFiles();

// ✅ Map controller routes
app.MapControllers();

// ✅ Fallback to index.html for React routing
app.MapFallbackToFile("index.html");

app.Run();
