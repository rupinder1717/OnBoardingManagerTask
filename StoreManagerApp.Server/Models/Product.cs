using System.ComponentModel.DataAnnotations;

namespace StoreManagerApp.Server.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public decimal Price { get; set; }

        // Navigation: A product can appear in many sales
        public ICollection<Sale> Sales { get; set; } = new List<Sale>();
    }
}
