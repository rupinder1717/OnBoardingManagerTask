using Microsoft.EntityFrameworkCore;
using StoreManagerApp.Server.Data;
using StoreManagerApp.Server.DTOs;
using StoreManagerApp.Server.Models;
using StoreManagerApp.Server.Services.Interfaces;

namespace StoreManagerApp.Server.Services.Implementations
{
    public class CustomerService : ICustomerService
    {
        private readonly AppDbContext _context;

        public CustomerService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CustomerDto>> GetAllAsync()
        {
            return await _context.Customers
                .Select(c => new CustomerDto { Id = c.Id, Name = c.Name, Address = c.Address })
                .ToListAsync();
        }

        public async Task<CustomerDto> GetByIdAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return null;

            return new CustomerDto { Id = customer.Id, Name = customer.Name, Address = customer.Address };
        }

        public async Task<CustomerDto> CreateAsync(CustomerDto dto)
        {
            var customer = new Customer { Name = dto.Name, Address = dto.Address };
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            dto.Id = customer.Id;
            return dto;
        }

        public async Task<CustomerDto> UpdateAsync(int id, CustomerDto dto)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return null;

            customer.Name = dto.Name;
            customer.Address = dto.Address;
            await _context.SaveChangesAsync();

            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return false;

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
