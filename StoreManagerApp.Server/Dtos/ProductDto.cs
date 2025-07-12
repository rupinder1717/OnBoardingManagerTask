namespace StoreManagerApp.Server.Dtos
{
    public class ProductDto
    {
        public int Id { get; set; }  // optional in POST
        public string Name { get; set; }
        public decimal Price { get; set; }
    }
}
