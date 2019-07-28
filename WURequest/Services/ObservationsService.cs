using System;
using System.Collections.Generic;
using MongoDB.Driver;
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
        //Finds all the observations for today based on DateTime object comparisons
        public List<Observations> Hourly()
        {
            var tm = DateTime.UtcNow.AddHours(-1);
            var obsersvations = _observation.Find(
            x => x.ObsTime > tm).ToList();
            return obsersvations;
        }
        public List<Observations> Daily()
        {
            var tm = DateTime.UtcNow.AddDays(-1);
            var obsersvations = _observation.Find(
            x => x.ObsTime > tm).ToList();
            return obsersvations;
        }
        public List<Observations> Weekly()
        {
            var tm = DateTime.UtcNow.AddDays(-7);
            var obsersvations = _observation.Find(
            x => x.ObsTime > tm).ToList();
            return obsersvations;
        }

        public List<Observations> Gets() =>
            // This was the method to get a date range when the DateTime object in WeatherDb was a string and not ISODate() 
            _observation.Find("{ \"DateTime\" :{ \"$gte\" : \"2019-07-21 13:00\", \"$lt\" : \"2019-07-21 13:10\"}}").Limit(10).ToList();
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
