namespace StoreManagerApp.Server.DTOs
{
    public class SaleDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string? CustomerName { get; set; }  // Optional for display only

        public int ProductId { get; set; }
        public string? ProductName { get; set; }   // Optional for display only

        public int StoreId { get; set; }
        public string? StoreName { get; set; }     // Optional for display only

        public DateTime DateSold { get; set; }
    }
}
