using StoreManagerApp.Server.Data;
using StoreManagerApp.Server.DTOs;
using StoreManagerApp.Server.Models;
using StoreManagerApp.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace StoreManagerApp.Server.Services.Implementations
{
    public class StoreService : IStoreService
    {
        private readonly AppDbContext _context;

        public StoreService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<StoreDto>> GetAllAsync()
        {
            return await _context.Stores
                .Select(s => new StoreDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Address = s.Address
                }).ToListAsync();
        }

        public async Task<StoreDto?> GetByIdAsync(int id)
        {
            var store = await _context.Stores.FindAsync(id);
            if (store == null) return null;

            return new StoreDto
            {
                Id = store.Id,
                Name = store.Name,
                Address = store.Address
            };
        }

        public async Task<StoreDto> CreateAsync(StoreDto dto)
        {
            var store = new Store
            {
                Name = dto.Name,
                Address = dto.Address
            };

            _context.Stores.Add(store);
            await _context.SaveChangesAsync();

            dto.Id = store.Id;
            return dto;
        }

        public async Task<bool> UpdateAsync(int id, StoreDto dto)
        {
            var store = await _context.Stores.FindAsync(id);
            if (store == null) return false;

            store.Name = dto.Name;
            store.Address = dto.Address;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var store = await _context.Stores.FindAsync(id);
            if (store == null) return false;

            _context.Stores.Remove(store);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
