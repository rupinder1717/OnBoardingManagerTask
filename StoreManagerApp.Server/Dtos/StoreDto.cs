namespace StoreManagerApp.Server.Dtos
{
    public class StoreDto
    {
        public int Id { get; set; }  // optional for POST
        public string Name { get; set; }
        public string Address { get; set; }
    }
}
