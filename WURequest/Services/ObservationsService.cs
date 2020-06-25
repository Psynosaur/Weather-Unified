using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using WURequest.Models;

namespace WURequest.Services
{
    public class ObservationsService
    {
        private readonly IMongoCollection<Observations> _observation;

        public ObservationsService(IObservationDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _observation = database.GetCollection<Observations>(settings.ObservationCollectionName);
        }

       //Finds all the observations for a time frame(hourly,daily and weekly) based on DateTime object comparisons
        public async Task<List<Observations>> Hourly(int id)
        {
            var tm = DateTime.Now;
            var hm = new DateTime(tm.Year, tm.Month, tm.Day, id, 0, 0, DateTimeKind.Local);
            var obsersvations = await _observation.Find(
                x => x.ObsTime > hm && x.ObsTime < hm.AddHours(1))
                .SortBy(e => e.ObsTime).ToListAsync();;
            return obsersvations;
        }
        public async Task<List<Observations>> Daily()
        {
            var tm = DateTime.Now;
            var hm = new DateTime(tm.Year, tm.Month, tm.Day, 0, 0, 0, DateTimeKind.Utc);
            // Offset for station timezone
            var pp = hm.AddHours(-2);
            var obsersvations = await _observation.Find(
                x => x.ObsTime > pp)
                .SortBy(e => e.ObsTime).ToListAsync();
            return obsersvations;
        }
        public async Task<List<Observations>> Date(string date)
        {
            DateTime tm = DateTime.ParseExact(date, "yyyy-MM-dd",
                System.Globalization.CultureInfo.InvariantCulture);
            var hm = new DateTime(tm.Year, tm.Month, tm.Day, 0, 0, 0, DateTimeKind.Local);
            // Offset for station timezone
            var dayStart = hm;
            var dayEnd = dayStart.AddDays(1);
            var obsersvations = await _observation.Find(
                    e => e.ObsTime > dayStart && e.ObsTime < dayEnd)
                .SortBy(e => e.ObsTime).ToListAsync();
            return obsersvations;
        }

        public async Task<List<Observations>> Weekly()
        {
            var tm = DateTime.UtcNow;
            var hm = new DateTime(tm.Year, tm.Month, tm.Day, 0, 0, 0, DateTimeKind.Utc);
            var weekstart = hm.AddDays(-6);
            var obsersvations = await _observation.Find(
                x => x.ObsTime > weekstart)
                .SortBy(e => e.ObsTime).ToListAsync();
            return obsersvations;
        }

        public List<List<RainObs>> Rain(string start, string end)
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
                        ObsTime = Convert.ToInt64((o.ObsTime - new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc)).TotalMilliseconds),
                        WindDirAvg10 = Convert.ToDecimal(o.WindDirAvg10),
                        WindDirAvg10Eng = o.WindDirAvg10Eng,
                        RainRateCur = Convert.ToDecimal(o.RainRateCur)
                    }).ToList();
                
                if(obs.Any()) rainydays.Add(obs);
                sd = sd.AddHours(24);
            }

            return rainydays;
        }
        public async Task<List<Observations>> Monthly()
        {
            var tm = DateTime.UtcNow;
            var hm = new DateTime(tm.Year, tm.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var obsersvations = await _observation.Find(
                x => x.ObsTime > hm)
                .SortBy(e => e.ObsTime).ToListAsync();
            return obsersvations;
        }
        
        public async Task<List<Observations>> Latest() =>
            await _observation
                .Find(observation => true)
                .Sort("{DateTime: -1}")
                .Limit(1)
                .ToListAsync();

        public async Task<IAsyncCursor<Observations>> Get(string id) =>
            await _observation.FindAsync(observation => observation.Id == id);

        public async Task Create(Observations observation)
        {
            await _observation.InsertOneAsync(observation);
        }

        public void Update(string id, Observations observationsIn) =>
            _observation.ReplaceOne(observation => observation.Id == id, observationsIn);

        public void Remove(Observations observationsIn) =>
            _observation.DeleteOne(observation => observation.Id == observationsIn.Id);

        public void Remove(string id) =>
            _observation.DeleteOne(observation => observation.Id == id);
    }
}