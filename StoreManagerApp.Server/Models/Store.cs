namespace StoreManagerApp.Server.Models
{
    public class Store
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Address { get; set; }

        // Navigation: A store can have many sales
        public ICollection<Sale> Sales { get; set; } = new List<Sale>();
    }
}
