using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using WURequest.Models;
using WURequest.Services;

namespace WUCharts.Services
{
    public class WeatherApiService : BaseHttpService, IWeatherApiService
    {
        private readonly string _baseUrl;
        private readonly string _forecastBaseUrl;

        public WeatherApiService(HttpClient httpClient, ILogger<WeatherApiService> logger, IOptions<AppSettings> appSettings)
            : base(httpClient, logger)
        {
            var appSettings1 = appSettings.Value;
            _baseUrl = $"{appSettings1.WURequestApiUrl}:{appSettings1.WURequestApiPort}/api/observations";
            _forecastBaseUrl = $"{appSettings1.WURequestApiUrl}:{appSettings1.WURequestApiPort}/api/forecasts";
        }

        public async Task<List<Observations>> GetLatestObservationsAsync()
        {
            return await GetAsync<List<Observations>>(_baseUrl, "fetching latest observations");
        }

        public async Task<List<Observations>> GetHourlyObservationsAsync(int hour)
        {
            var url = $"{_baseUrl}/hourly/{hour}";
            return await GetAsync<List<Observations>>(url, $"fetching hourly observations for hour {hour}");
        }

        public async Task<List<Observations>> GetDailyObservationsAsync()
        {
            var url = $"{_baseUrl}/daily";
            return await GetAsync<List<Observations>>(url, "fetching daily observations");
        }

        public async Task<List<Observations>> GetWeeklyObservationsAsync()
        {
            var url = $"{_baseUrl}/weekly";
            return await GetAsync<List<Observations>>(url, "fetching weekly observations");
        }

        public async Task<List<Observations>> GetMonthlyObservationsAsync()
        {
            var url = $"{_baseUrl}/monthly";
            return await GetAsync<List<Observations>>(url, "fetching monthly observations");
        }

        public async Task<List<Observations>> GetObservationsByDateAsync(string date)
        {
            var url = $"{_baseUrl}/date/{date}";
            return await GetAsync<List<Observations>>(url, $"fetching observations for date {date}");
        }

        public async Task<List<List<RainObs>>> GetRainDataAsync(string start, string end)
        {
            var url = $"{_baseUrl}/rain?start={start}&end={end}";
            return await GetAsync<List<List<RainObs>>>(url, $"fetching rain data from {start} to {end}");
        }

        public async Task<long> GetObservationCountAsync()
        {
            var url = $"{_baseUrl}/count";
            return await GetPrimitiveAsync<long>(url, "fetching observation count", 0L);
        }

        public async Task<Forecasts> GetLatestForecastAsync()
        {
            return await GetAsync<Forecasts>(_forecastBaseUrl, "fetching latest forecast");
        }
    }
}
