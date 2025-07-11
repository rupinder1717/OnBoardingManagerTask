using Microsoft.AspNetCore.Mvc;
using StoreManagerApp.Server.DTOs;
using StoreManagerApp.Server.Services.Interfaces;

namespace StoreManagerApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaleController : ControllerBase
    {
        private readonly ISaleService _saleService;

        public SaleController(ISaleService saleService)
        {
            _saleService = saleService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SaleDto>>> GetSales()
        {
            try
            {
                var sales = await _saleService.GetAllAsync();
                return Ok(sales);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to load sales", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SaleDto>> GetSale(int id)
        {
            var sale = await _saleService.GetByIdAsync(id);
            if (sale == null)
                return NotFound(new { message = "Sale not found" });

            return Ok(sale);
        }

        [HttpPost]
        public async Task<ActionResult<SaleDto>> CreateSale([FromBody] SaleDto saleDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var createdSale = await _saleService.CreateAsync(saleDto);
                if (createdSale == null)
                    return BadRequest(new { message = "Invalid foreign key(s)." });

                return CreatedAtAction(nameof(GetSale), new { id = createdSale.Id }, createdSale);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to create sale", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSale(int id, [FromBody] SaleDto saleDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (id != saleDto.Id)
                return BadRequest(new { message = "Sale ID mismatch." });

            try
            {
                var updatedSale = await _saleService.UpdateAsync(id, saleDto);
                if (updatedSale == null)
                    return NotFound(new { message = "Sale not found" });

                return Ok(updatedSale); // Optionally use NoContent() instead
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to update sale", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSale(int id)
        {
            try
            {
                var success = await _saleService.DeleteAsync(id);
                if (!success)
                    return NotFound(new { message = "Sale not found" });

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to delete sale", details = ex.Message });
            }
        }
    }
}
