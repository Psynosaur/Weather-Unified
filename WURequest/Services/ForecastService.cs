using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using WURequest.Models;

namespace WURequest.Services
{
    public class ForecastService
    {
        private readonly IMongoCollection<Forecasts> _forecast;

        public ForecastService(IForecastDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _forecast = database.GetCollection<Forecasts>(settings.ForecastCollectionName);
        }
        public async Task<List<Forecasts>> Latest() =>
            await _forecast
                .Find(doc => true)
                .Limit(1)
                .Sort("{$natural:-1}").ToListAsync();

        public async Task Create(Forecasts fc)
        {
            await _forecast.InsertOneAsync(fc);
        }
    }
}