using System.ComponentModel.DataAnnotations;

namespace StoreManagerApp.Server.Models
{
    public class Customer
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string Address { get; set; }

        // Navigation: A customer can have many sales
        public ICollection<Sale> Sales { get; set; } = new List<Sale>();
    }
}
