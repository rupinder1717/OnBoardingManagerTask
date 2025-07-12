using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreManagerApp.Server.Data;
using StoreManagerApp.Server.Models;
using StoreManagerApp.Server.Dtos;

namespace StoreManagerApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StoreController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StoreController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/store
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StoreDto>>> GetAll()
        {
            var stores = await _context.Stores.ToListAsync();

            var storeDtos = stores.Select(s => new StoreDto
            {
                Id = s.Id,
                Name = s.Name,
                Address = s.Address
            });

            return Ok(storeDtos);
        }

        // GET: api/store/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<StoreDto>> GetById(int id)
        {
            var store = await _context.Stores.FindAsync(id);
            if (store == null)
                return NotFound(new { message = $"Store with ID {id} not found." });

            var dto = new StoreDto
            {
                Id = store.Id,
                Name = store.Name,
                Address = store.Address
            };

            return Ok(dto);
        }

        // POST: api/store
        [HttpPost]
        public async Task<ActionResult<StoreDto>> Create([FromBody] StoreDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var store = new Store
            {
                Name = dto.Name,
                Address = dto.Address
            };

            _context.Stores.Add(store);
            await _context.SaveChangesAsync();

            dto.Id = store.Id;
            return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
        }

        // PUT: api/store/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] StoreDto dto)
        {
            if (dto == null || id != dto.Id)
                return BadRequest("Invalid store data.");

            var store = await _context.Stores.FindAsync(id);
            if (store == null)
                return NotFound(new { message = $"Store with ID {id} not found." });

            store.Name = dto.Name;
            store.Address = dto.Address;

            await _context.SaveChangesAsync();
            return Ok(dto);
        }

        // DELETE: api/store/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var store = await _context.Stores.FindAsync(id);
            if (store == null)
                return NotFound(new { message = $"Store with ID {id} not found." });

            _context.Stores.Remove(store);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
