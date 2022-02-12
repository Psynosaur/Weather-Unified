using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using WURequest.Models;

namespace WURequest.Services
{
    public class ObservationsService : IObservationsService
    {
        private readonly IMongoCollection<Observations> _observation;
        private readonly ILogger _logger;

        public ObservationsService(IObservationDatabaseSettings settings, ILoggerFactory logFactory)
        {
            var mongoConnectionUrl = new MongoUrl(settings.ConnectionString);
            var mongoClientSettings = MongoClientSettings.FromUrl(mongoConnectionUrl);
            // mongoClientSettings.ClusterConfigurator = cb => {
            //     cb.Subscribe<CommandStartedEvent>(e => {
            //         Console.WriteLine($"{e.CommandName} - {e.Command.ToJson()}");
            //     });
            // };
            var client = new MongoClient(mongoClientSettings);
            var database = client.GetDatabase(settings.DatabaseName);
            _observation = database.GetCollection<Observations>(settings.ObservationCollectionName);
            _logger = logFactory.CreateLogger<ObservationsService>();
        }

        //Finds all the observations for a time frame(hourly,daily and weekly) based on DateTime object comparisons
        public async Task<List<Observations>> Hourly(int id)
        {
            try
            {
                var tm = DateTime.Now;
                var hm = new DateTime(tm.Year, tm.Month, tm.Day, id, 0, 0, DateTimeKind.Local);
                var observations = await _observation.Find(
                        x => x.ObsTime > hm && x.ObsTime < hm.AddHours(1))
                    .SortBy(e => e.ObsTime).ToListAsync();
                return observations;
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
        }

        public async Task<List<Observations>> Daily()
        {
            try
            {
                var tm = DateTime.Now;
                var hm = new DateTime(tm.Year, tm.Month, tm.Day, 0, 0, 0, DateTimeKind.Utc);
                // Offset for station timezone
                var pp = hm.AddHours(-2);
                var observations = await _observation.Find(
                        x => x.ObsTime > pp)
                    .SortBy(e => e.ObsTime).ToListAsync();
                return observations;
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
        }

        public async Task<List<Observations>> Date(string date)
        {
            try
            {
                var tm = DateTime.ParseExact(date, "yyyy-MM-dd",
                    System.Globalization.CultureInfo.InvariantCulture);
                var dayStart = new DateTime(tm.Year, tm.Month, tm.Day, 0, 0, 0, DateTimeKind.Local);
                // Offset for station timezone
                var dayEnd = dayStart.AddDays(1);
                var observations = await _observation.Find(
                        e => e.ObsTime >= dayStart && e.ObsTime <= dayEnd)
                    .SortBy(e => e.ObsTime).ToListAsync();
                return observations;
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
        }

        public async Task<List<Observations>> Weekly()
        {
            try
            {
                var tm = DateTime.UtcNow;
                var hm = new DateTime(tm.Year, tm.Month, tm.Day, 0, 0, 0, DateTimeKind.Utc);
                var weekstart = hm.AddDays(-6);
                var observations = await _observation.Find(
                        x => x.ObsTime > weekstart)
                    .SortBy(e => e.ObsTime).ToListAsync();
                return observations;
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
        }

        public List<List<RainObs>> Rain(string start, string end)
        {
            try
            {
                DateTime temp;
                DateTime startDate;
                DateTime endDate;
                var sd = new DateTime();
                var ed = new DateTime();
                if (DateTime.TryParse(start, out temp))
                {
                    startDate = DateTime.ParseExact(start, "yyyy-MM-dd",
                        System.Globalization.CultureInfo.InvariantCulture);
                    sd = new DateTime(
                        startDate.Year,
                        startDate.Month,
                        startDate.Day,
                        0,
                        0,
                        0,
                        DateTimeKind.Utc);
                }

                if (DateTime.TryParse(end, out temp))
                {
                    endDate = DateTime.ParseExact(end, "yyyy-MM-dd",
                        System.Globalization.CultureInfo.InvariantCulture);
                    ed = new DateTime(
                        endDate.Year,
                        endDate.Month,
                        endDate.Day,
                        0,
                        0,
                        0,
                        DateTimeKind.Utc);
                }

                var rainydays = new List<List<RainObs>>();
                while (sd < ed)
                {
                    var date = sd;
                    var obs = _observation.Find(
                            x => x.ObsTime > date && x.ObsTime < date.AddHours(24) && x.RainRateCur > 0)
                        .SortBy(e => e.ObsTime).ToList()
                        .Select(o =>
                            new RainObs
                            {
                                ObsTime = Convert.ToInt64(
                                    (o.ObsTime - new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc))
                                    .TotalMilliseconds),
                                WindDirAvg10 = Convert.ToDecimal(o.WindDirAvg10),
                                WindDirAvg10Eng = o.WindDirAvg10Eng,
                                RainRateCur = Convert.ToDecimal(o.RainRateCur)
                            }).ToList();
                    if (obs.Any()) rainydays.Add(obs);
                    sd = sd.AddHours(24);
                }
                return rainydays;
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
        }

        public async Task<List<Observations>> Monthly()
        {
            try
            {
                var utcNow = DateTime.UtcNow;
                var thirtydaysago = utcNow.AddMonths(-1);
                var observations = await _observation.Find(
                        x => x.ObsTime > thirtydaysago)
                    .SortBy(e => e.ObsTime).ToListAsync();
                return observations;
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
        }

        public async Task<List<Observations>> Latest()
        {
            try
            {
                List<Observations> observations;
                observations = await _observation
                    .Find(os => true)
                    .Sort("{DateTime: -1}")
                    .Limit(1).ToListAsync();
                if (observations.Count == 0)
                {
                    await Create(new Observations
                    {
                        ObsTime = DateTime.UtcNow,
                    });
                    observations = await Latest();
                }
                return observations;
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
        }
        public long Count()
        {
            try
            {
                
                var cnt =  _observation
                    .CountDocuments(os => true);
                
                return cnt;
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
        }

        public async Task<IAsyncCursor<Observations>> Get(string id)
        {
            try
            {
                return await _observation.FindAsync(observation => observation.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
        }

        public async Task Create(Observations observation)
        {
            try
            {
                await _observation.InsertOneAsync(observation);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
        }

        public void Update(string id, Observations observationsIn) =>
            _observation.ReplaceOne(observation => observation.Id == id, observationsIn);

        public void Remove(string id) =>
            _observation.DeleteOne(observation => observation.Id == id);
    }

}