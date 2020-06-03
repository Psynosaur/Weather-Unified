using System;
using System.Collections.Generic;
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

        //db.Observations.find({ "DateTime" :{ "$gte" : "2019-07-21 13:00", "$lt" : "2019-07-21 13:10"}})
        public List<WUObservations> LatestWu()
        {
            return null;
        }

        //Finds all the observations for a time frame(hourly,daily and weekly) based on DateTime object comparisons
        public List<Observations> Hourly(int id)
        {
            var tm = DateTime.Now;
            var hm = new DateTime(tm.Year, tm.Month, tm.Day, id, 0, 0, DateTimeKind.Local);
            var obsersvations = _observation.Find(
                x => x.ObsTime > hm && x.ObsTime < hm.AddHours(1)).ToList();
            return obsersvations;
        }
        public List<ChartObs> HObs()
        {
            var tm = DateTime.UtcNow;
            var hm = new DateTime(tm.Year, tm.Month, tm.Day, tm.Hour, 0, 0, DateTimeKind.Utc);
            var obsersvations = _observation.Find(
                x => x.ObsTime > hm).ToList();
            JArray json = JArray.Parse(obsersvations.ToString()); 
            var crt = json.ToObject<List<ChartObs>>();
            return crt;
        }

        public List<Observations> Daily()
        {
            var tm = DateTime.Now;
            var hm = new DateTime(tm.Year, tm.Month, tm.Day, 0, 0, 0, DateTimeKind.Utc);
            // Offset for station timezone
            var pp = hm.AddHours(-2);
            var obsersvations = _observation.Find(
                x => x.ObsTime > pp).ToList();
            return obsersvations;
        }
        public List<Observations> Date(string date)
        {
            // var tm = DateTime.Now;
            DateTime tm = DateTime.ParseExact(date, "yyyy-MM-dd",
                System.Globalization.CultureInfo.InvariantCulture);
            var hm = new DateTime(tm.Year, tm.Month, tm.Day, 0, 0, 0, DateTimeKind.Utc);
            // Offset for station timezone
            var dayStart = hm.AddHours(-2);
            var dayEnd = dayStart.AddDays(1);
            var obsersvations = _observation.Find(
                x => x.ObsTime > dayStart && x.ObsTime < dayEnd).ToList();
            return obsersvations;
        }

        public List<Observations> Weekly()
        {
//            var weekstart = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek + (int)DayOfWeek.Saturday);
            var tm = DateTime.UtcNow;
            var hm = new DateTime(tm.Year, tm.Month, tm.Day, 0, 0, 0, DateTimeKind.Utc);
            var weekstart = hm.AddDays(-6);
            var obsersvations = _observation.Find(
                x => x.ObsTime > weekstart).ToList();
            return obsersvations;
        }
        
        public List<Observations> Monthly()
        {
            var tm = DateTime.UtcNow;
            var hm = new DateTime(tm.Year, tm.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var obsersvations = _observation.Find(
                x => x.ObsTime > hm).ToList();
            return obsersvations;
        }

        public List<Observations> Gets() =>
            // This was the method to get a date range when the DateTime object in WeatherDb as a string and not ISODate() 
            _observation.Find("{ \"DateTime\" :{ \"$gte\" : \"2019-07-21 13:00\", \"$lt\" : \"2019-07-21 13:10\"}}")
                .Limit(10).ToList();

        //_observation.Find(Observation => true).Sort("{DateTime: -1}").Limit(10).ToList();
        //_observation.Find(x => x.TempOutCur == 13.0).ToList();
        public List<Observations> Latest() =>
            _observation
                .Find(Observation => true)
                .Sort("{DateTime: -1}")
                .Limit(1)
                .ToList();

        public Observations Get(string id) =>
            _observation.Find(Observation => Observation.Id == id).FirstOrDefault();

        public Observations Create(Observations observations)
        {
            _observation.InsertOne(observations);
            return observations;
        }

        public void Update(string id, Observations observationsIn) =>
            _observation.ReplaceOne(Observation => Observation.Id == id, observationsIn);

        public void Remove(Observations observationsIn) =>
            _observation.DeleteOne(Observation => Observation.Id == observationsIn.Id);

        public void Remove(string id) =>
            _observation.DeleteOne(Observation => Observation.Id == id);
    }
}