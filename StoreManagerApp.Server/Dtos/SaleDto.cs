namespace StoreManagerApp.Server.Dtos
{
    public class SaleDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }  // from navigation

        public int CustomerId { get; set; }
        public string CustomerName { get; set; }

        public int StoreId { get; set; }
        public string StoreName { get; set; }

        public DateTime DateSold { get; set; }
    }
}
