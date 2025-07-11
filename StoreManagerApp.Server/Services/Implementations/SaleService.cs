using StoreManagerApp.Server.Data;
using StoreManagerApp.Server.DTOs;
using StoreManagerApp.Server.Models;
using StoreManagerApp.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace StoreManagerApp.Server.Services.Implementations
{
    public class SaleService : ISaleService
    {
        private readonly AppDbContext _context;

        public SaleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<SaleDto>> GetAllAsync()
        {
            return await _context.Sales
                .Include(s => s.Customer)
                .Include(s => s.Product)
                .Include(s => s.Store)
                .Select(s => new SaleDto
                {
                    Id = s.Id,
                    CustomerId = s.CustomerId,
                    CustomerName = s.Customer.Name,
                    ProductId = s.ProductId,
                    ProductName = s.Product.Name,
                    StoreId = s.StoreId,
                    StoreName = s.Store.Name,
                    DateSold = s.DateSold
                })
                .ToListAsync();
        }

        public async Task<SaleDto?> GetByIdAsync(int id)
        {
            var sale = await _context.Sales
                .Include(s => s.Customer)
                .Include(s => s.Product)
                .Include(s => s.Store)
                .FirstOrDefaultAsync(s => s.Id == id);

            return sale == null ? null : new SaleDto
            {
                Id = sale.Id,
                CustomerId = sale.CustomerId,
                CustomerName = sale.Customer?.Name,
                ProductId = sale.ProductId,
                ProductName = sale.Product?.Name,
                StoreId = sale.StoreId,
                StoreName = sale.Store?.Name,
                DateSold = sale.DateSold
            };
        }

        public async Task<SaleDto> CreateAsync(SaleDto dto)
        {
            var sale = new Sale
            {
                CustomerId = dto.CustomerId,
                ProductId = dto.ProductId,
                StoreId = dto.StoreId,
                DateSold = dto.DateSold
            };

            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();

            // Load related navigation properties
            await _context.Entry(sale).Reference(s => s.Customer).LoadAsync();
            await _context.Entry(sale).Reference(s => s.Product).LoadAsync();
            await _context.Entry(sale).Reference(s => s.Store).LoadAsync();

            return new SaleDto
            {
                Id = sale.Id,
                CustomerId = sale.CustomerId,
                CustomerName = sale.Customer?.Name,
                ProductId = sale.ProductId,
                ProductName = sale.Product?.Name,
                StoreId = sale.StoreId,
                StoreName = sale.Store?.Name,
                DateSold = sale.DateSold
            };
        }

        public async Task<SaleDto?> UpdateAsync(int id, SaleDto dto)
        {
            var sale = await _context.Sales.FindAsync(id);
            if (sale == null) return null;

            sale.CustomerId = dto.CustomerId;
            sale.ProductId = dto.ProductId;
            sale.StoreId = dto.StoreId;
            sale.DateSold = dto.DateSold;

            await _context.SaveChangesAsync();

            // Refresh related names
            await _context.Entry(sale).Reference(s => s.Customer).LoadAsync();
            await _context.Entry(sale).Reference(s => s.Product).LoadAsync();
            await _context.Entry(sale).Reference(s => s.Store).LoadAsync();

            return new SaleDto
            {
                Id = sale.Id,
                CustomerId = sale.CustomerId,
                CustomerName = sale.Customer?.Name,
                ProductId = sale.ProductId,
                ProductName = sale.Product?.Name,
                StoreId = sale.StoreId,
                StoreName = sale.Store?.Name,
                DateSold = sale.DateSold
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var sale = await _context.Sales.FindAsync(id);
            if (sale == null) return false;

            _context.Sales.Remove(sale);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
