namespace StoreManagerApp.Server.DTOs
{
    public class StoreDto
    {
        public int Id { get; set; }  // Required for GET and PUT operations

        public string Name { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;
    }
}
