namespace TheSeatLineApi.Common.Enums
{
    public enum PaymentStatus
    {
        Initiated = 1,
        Success = 2,
        Failed = 3,
        Refunded = 4,
        Pending = 5
    }

    public enum PaymentMethod
    {
        CreditCard = 1,
        DebitCard = 2,
        UPI = 3,
        NetBanking = 4,
        Wallet = 5,
        Cash = 6
    }

    public enum RefundStatus
    {
        Requested = 1,
        Approved = 2,
        Rejected = 3,
        Processed = 4
    }
}
