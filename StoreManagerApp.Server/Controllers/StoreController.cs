using Microsoft.AspNetCore.Mvc;
using StoreManagerApp.Server.DTOs;
using StoreManagerApp.Server.Services.Interfaces;

namespace StoreManagerApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoreController : ControllerBase
    {
        private readonly IStoreService _storeService;

        public StoreController(IStoreService storeService)
        {
            _storeService = storeService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StoreDto>>> GetStores()
        {
            try
            {
                var stores = await _storeService.GetAllAsync();
                return Ok(stores);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to load stores", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<StoreDto>> CreateStore([FromBody] StoreDto storeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var createdStore = await _storeService.CreateAsync(storeDto);
                return CreatedAtAction(nameof(GetStores), new { id = createdStore.Id }, createdStore);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to create store", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStore(int id, [FromBody] StoreDto storeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _storeService.UpdateAsync(id, storeDto);
                if (!result)
                    return NotFound(new { message = "Store not found" });

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to update store", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStore(int id)
        {
            try
            {
                var result = await _storeService.DeleteAsync(id);
                if (!result)
                    return NotFound(new { message = "Store not found" });

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to delete store", details = ex.Message });
            }
        }
    }
}
