using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreManagerApp.Server.Data;
using StoreManagerApp.Server.Models;
using StoreManagerApp.Server.Dtos;

namespace StoreManagerApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CustomerController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/customer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetAll()
        {
            var customers = await _context.Customers.ToListAsync();

            var customerDtos = customers.Select(c => new CustomerDto
            {
                Id = c.Id,
                Name = c.Name,
                Address = c.Address
            });

            return Ok(customerDtos);
        }

        // GET: api/customer/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerDto>> GetById(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
                return NotFound(new { message = $"Customer with ID {id} not found." });

            var dto = new CustomerDto
            {
                Id = customer.Id,
                Name = customer.Name,
                Address = customer.Address
            };

            return Ok(dto);
        }

        // POST: api/customer
        [HttpPost]
        public async Task<ActionResult<CustomerDto>> Create([FromBody] CustomerDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var customer = new Customer
            {
                Name = dto.Name,
                Address = dto.Address
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            dto.Id = customer.Id;
            return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
        }

        // PUT: api/customer/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CustomerDto dto)
        {
            if (dto == null || id != dto.Id)
                return BadRequest("Invalid customer data.");

            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
                return NotFound(new { message = $"Customer with ID {id} not found." });

            customer.Name = dto.Name;
            customer.Address = dto.Address;

            await _context.SaveChangesAsync();
            return Ok(dto);
        }

        // DELETE: api/customer/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
                return NotFound(new { message = $"Customer with ID {id} not found." });

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
