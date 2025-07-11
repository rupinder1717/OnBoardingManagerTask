using StoreManagerApp.Server.DTOs;

namespace StoreManagerApp.Server.Services.Interfaces
{
    public interface IStoreService
    {
        Task<List<StoreDto>> GetAllAsync();
        Task<StoreDto?> GetByIdAsync(int id);
        Task<StoreDto> CreateAsync(StoreDto dto);
        Task<bool> UpdateAsync(int id, StoreDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
