namespace TheSeatLineApi.Common.Enums
{
    public enum BookingStatus
    {
        Pending = 1,
        Confirmed = 2,
        Failed = 3,
        Cancelled = 4,
        Refunded = 5,
        Expired = 6,
        Transfered = 7
    }

    public enum TicketDeliveryType
    {
        QRCode = 1,
        Email = 2,
        SMS = 3
    }
}
