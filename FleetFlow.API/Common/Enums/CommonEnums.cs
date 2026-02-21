namespace TheSeatLineApi.Common.Enums
{
    public enum RecordStatus
    {
        Active = 1,
        Inactive = 2,
        Deleted = 3
    }

    public enum AuditAction
    {
        Created = 1,
        Updated = 2,
        Deleted = 3,
        Approved = 4,
        Rejected = 5
    }

    public enum SortOrder
    {
        Asc = 1,
        Desc = 2
    }
}
