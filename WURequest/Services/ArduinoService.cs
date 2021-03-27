using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using WURequest.Models;

namespace WURequest.Services
{
    public class ArduinoService
    {
        private readonly IMongoCollection<ArduinoObservation> _arduino;
        private readonly ILogger _logger;

        public ArduinoService(IArduinoDatabaseSettings settings, ILoggerFactory logFactory)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _arduino = database.GetCollection<ArduinoObservation>(settings.ArduinoCollectionName);
            _logger = logFactory.CreateLogger<ForecastService>();;
        }
        public async Task<List<ArduinoObservation>> Latest()
        {
            try
            {
                return await _arduino
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
        public async Task<List<ArduinoObservation>> Date(string date)
        {
            try
            {
                DateTime tm = DateTime.ParseExact(date, "yyyy-MM-dd",
                    System.Globalization.CultureInfo.InvariantCulture);
                var hm = new DateTime(tm.Year, tm.Month, tm.Day, 0, 0, 0, DateTimeKind.Local);
                // Offset for station timezone
                var dayStart = hm;
                var dayEnd = dayStart.AddDays(1);
                var obsersvations = await _arduino.Find(
                        e => e.ObsTime > dayStart && e.ObsTime < dayEnd)
                    .SortBy(e => e.ObsTime).ToListAsync();
                return obsersvations;
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
        }
        public async Task<List<ArduinoObservation>> Weekly()
        {
            try
            {
                var tm = DateTime.UtcNow;
                var hm = new DateTime(tm.Year, tm.Month, tm.Day, 0, 0, 0, DateTimeKind.Utc);
                var weekstart = hm.AddDays(-6);
                var obsersvations = await _arduino.Find(
                        x => x.ObsTime > weekstart)
                    .SortBy(e => e.ObsTime).ToListAsync();
                return obsersvations;
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
        }

        public async Task Create(ArduinoObservation ad)
        {
            try
            {
                await _arduino.InsertOneAsync(ad);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
            
        }
    }
}