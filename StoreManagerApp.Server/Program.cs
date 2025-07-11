using Microsoft.EntityFrameworkCore;
using StoreManagerApp.Server.Data;
using StoreManagerApp.Server.Services;
using StoreManagerApp.Server.Services.Implementations;
using StoreManagerApp.Server.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// ✅ Register SQLite DB context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// ✅ Register application services (DI)
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IStoreService, StoreService>();
builder.Services.AddScoped<ISaleService, SaleService>();

// ✅ Add AutoMapper if you're using it (optional)
// builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// ✅ Add controllers
builder.Services.AddControllers();

// ✅ Configure CORS to allow frontend access
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://localhost:4173", "https://storemanagerappclient20250710.azurestaticapps.net")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ✅ Add Swagger/OpenAPI for development
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ✅ Enable Swagger only in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ✅ Middleware pipeline
app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();

app.UseDefaultFiles();         // For static web hosting (optional)
app.UseStaticFiles();

app.MapControllers();

// ✅ SPA fallback (optional if using React routing)
app.MapFallbackToFile("index.html");

app.Run(); 