
namespace TheSeatLineApi.AuthServices.Repository
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<Guid> AddAsync(User user);
        Task UpdateAsync(User user);
    }
}
