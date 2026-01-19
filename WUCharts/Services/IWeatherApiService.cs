using System.Collections.Generic;
using System.Threading.Tasks;
using WURequest.Models;

namespace WUCharts.Services
{
    public interface IWeatherApiService
    {
        Task<List<Observations>> GetLatestObservationsAsync();
        Task<List<Observations>> GetHourlyObservationsAsync(int hour);
        Task<List<Observations>> GetDailyObservationsAsync();
        Task<List<Observations>> GetWeeklyObservationsAsync();
        Task<List<Observations>> GetMonthlyObservationsAsync();
        Task<List<Observations>> GetObservationsByDateAsync(string date);
        Task<List<List<RainObs>>> GetRainDataAsync(string start, string end);
        Task<long> GetObservationCountAsync();
        Task<Forecasts> GetLatestForecastAsync();
    }
}
