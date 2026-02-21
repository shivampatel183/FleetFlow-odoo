using TheSeatLineApi.MasterServices.DTOs;

namespace TheSeatLineApi.Common
{
    public class Response<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string? Message { get; set; }
        public string? Error { get; set; }

        public static Response<T> Ok(T data, string? message = null)
        {
            return new Response<T>
            {
                Success = true,
                Data = data,
                Message = message,
                Error = null
            };
        }

        public static Response<T> Fail(string errorMessage)
        {
            return new Response<T>
            {
                Success = false,
                Data = default,
                Message = null,
                Error = errorMessage
            };
        }

        internal static Response<CitySelectDTO> Ok(object value)
        {
            throw new NotImplementedException();
        }
    }
}
