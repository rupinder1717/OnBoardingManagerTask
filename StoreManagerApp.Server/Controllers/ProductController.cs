using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreManagerApp.Server.Data;
using StoreManagerApp.Server.Models;
using StoreManagerApp.Server.Dtos;

namespace StoreManagerApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAll()
        {
            var products = await _context.Products.ToListAsync();

            var productDtos = products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price
            });

            return Ok(productDtos);
        }

        // GET: api/product/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetById(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound(new { message = $"Product with ID {id} not found." });

            var dto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price
            };

            return Ok(dto);
        }

        // POST: api/product
        [HttpPost]
        public async Task<ActionResult<ProductDto>> Create([FromBody] ProductDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var product = new Product
            {
                Name = dto.Name,
                Price = dto.Price
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            dto.Id = product.Id;
            return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
        }

        // PUT: api/product/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductDto dto)
        {
            if (dto == null || id != dto.Id)
                return BadRequest("Invalid product data.");

            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound(new { message = $"Product with ID {id} not found." });

            product.Name = dto.Name;
            product.Price = dto.Price;

            await _context.SaveChangesAsync();
            return Ok(dto);
        }

        // DELETE: api/product/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound(new { message = $"Product with ID {id} not found." });

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
