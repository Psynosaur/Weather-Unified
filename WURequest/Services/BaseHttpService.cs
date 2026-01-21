using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MongoDB.Bson.Serialization;

namespace WURequest.Services
{
    public abstract class BaseHttpService
    {
        protected readonly HttpClient _httpClient;
        protected readonly ILogger _logger;
        
        private static readonly JsonSerializerOptions JsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        protected BaseHttpService(HttpClient httpClient, ILogger logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        protected async Task<T> GetAsync<T>(string url, string operationName) where T : new()
        {
            try
            {
                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();
                
                var jsonString = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<T>(jsonString, JsonOptions) ?? new T();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error {OperationName} from API", operationName);
                return new T();
            }
        }

        protected async Task<T> GetWithBsonAsync<T>(string url, string operationName) where T : new()
        {
            try
            {
                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();
                
                var jsonString = await response.Content.ReadAsStringAsync();
                return BsonSerializer.Deserialize<T>(jsonString);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error {OperationName} from API", operationName);
                return new T();
            }
        }

        protected async Task<T> GetPrimitiveAsync<T>(string url, string operationName, T defaultValue = default(T))
        {
            try
            {
                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();
                
                var jsonString = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<T>(jsonString, JsonOptions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error {OperationName} from API", operationName);
                return defaultValue;
            }
        }
    }
}
