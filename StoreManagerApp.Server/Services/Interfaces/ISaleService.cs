using StoreManagerApp.Server.DTOs;

namespace StoreManagerApp.Server.Services.Interfaces
{
    public interface ISaleService
    {
        Task<List<SaleDto>> GetAllAsync();
        Task<SaleDto?> GetByIdAsync(int id);
        Task<SaleDto> CreateAsync(SaleDto dto);          // Returns full DTO with names
        Task<SaleDto?> UpdateAsync(int id, SaleDto dto); // Also returns full DTO with names
        Task<bool> DeleteAsync(int id);
    }
}
