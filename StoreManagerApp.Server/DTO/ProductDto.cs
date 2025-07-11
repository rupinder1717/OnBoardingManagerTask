namespace StoreManagerApp.Server.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }  // Required for GET/PUT
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}
