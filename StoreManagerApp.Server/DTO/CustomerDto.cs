namespace StoreManagerApp.Server.DTOs
{
    public class CustomerDto
    {
        public int Id { get; set; }  // Required for GET/PUT
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
    }
}
