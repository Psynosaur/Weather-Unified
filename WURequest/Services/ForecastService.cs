using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using WURequest.Models;

namespace WURequest.Services
{
    public class ForecastService
    {
        private readonly IMongoCollection<Forecasts> _forecast;
        private readonly ILogger _logger;

        public ForecastService(IForecastDatabaseSettings settings, ILoggerFactory logFactory)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _forecast = database.GetCollection<Forecasts>(settings.ForecastCollectionName);
            _logger = logFactory.CreateLogger<ForecastService>();;
        }
        public async Task<List<Forecasts>> Latest()
        {
            try
            {
                return await _forecast
                    .Find(doc => true)
                    .Limit(1)
                    .Sort("{$natural:-1}").ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
        }

        public async Task Create(Forecasts fc)
        {
            try
            {
                await _forecast.InsertOneAsync(fc);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
            
        }
    }
}