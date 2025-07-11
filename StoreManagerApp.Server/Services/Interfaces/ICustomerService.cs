using StoreManagerApp.Server.DTOs;

namespace StoreManagerApp.Server.Services.Interfaces
{
    public interface ICustomerService
    {
        Task<IEnumerable<CustomerDto>> GetAllAsync();
        Task<CustomerDto> GetByIdAsync(int id);
        Task<CustomerDto> CreateAsync(CustomerDto customerDto);
        Task<CustomerDto> UpdateAsync(int id, CustomerDto customerDto);
        Task<bool> DeleteAsync(int id);
    }
}
