using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using WURequest.Models;

namespace WURequest.Services
{
    public interface IForecastApiService
    {
        Task<Forecasts> GetForecastAsync();
    }

    public class ForecastApiService : BaseHttpService, IForecastApiService
    {
        private readonly IWeatherUndergroundApiSettings _weatherUndergroundApiSettings;

        public ForecastApiService(
            HttpClient httpClient, 
            ILogger<ForecastApiService> logger,
            IWeatherUndergroundApiSettings weatherUndergroundApiSettings)
            : base(httpClient, logger)
        {
            _weatherUndergroundApiSettings = weatherUndergroundApiSettings;
            
            // Configure HttpClient headers
            _httpClient.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<Forecasts> GetForecastAsync()
        {
            var url = string.Format(
                "https://api.weather.com/v3/wx/forecast/daily/5day?geocode={0},{1}&format={2}&units={3}&language={4}&apiKey={5}",
                _weatherUndergroundApiSettings.Lat,
                _weatherUndergroundApiSettings.Lon,
                _weatherUndergroundApiSettings.Format,
                _weatherUndergroundApiSettings.Units,
                _weatherUndergroundApiSettings.Language,
                _weatherUndergroundApiSettings.Pat
            );

            return await GetWithBsonAsync<Forecasts>(url, "fetching weather forecast");
        }
    }
}
