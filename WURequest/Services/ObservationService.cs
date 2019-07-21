using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using WURequest.Models;

namespace WURequest.Services
{
    public class ObservationService
    {
        private readonly IMongoCollection<Observation> _observation;

        public ObservationService(IObservationDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _observation = database.GetCollection<Observation>(settings.ObservationCollectionName);
        }

        public List<Observation> Get() =>
            _observation.Find(Observation => true).ToList();
        public List<Observation> Latest() =>
            _observation
                .Find(Observation => true)
                .Sort("{DateTime: -1}")
                .Limit(1)
                .ToList();
        public Observation Get(string id) =>
            _observation.Find(Observation => Observation.Id == id).FirstOrDefault();

        public Observation Create(Observation Observation)
        {
            _observation.InsertOne(Observation);
            return Observation;
        }

        public void Update(string id, Observation ObservationIn) =>
            _observation.ReplaceOne(Observation => Observation.Id == id, ObservationIn);

        public void Remove(Observation ObservationIn) =>
            _observation.DeleteOne(Observation => Observation.Id == ObservationIn.Id);

        public void Remove(string id) =>
            _observation.DeleteOne(Observation => Observation.Id == id);
    }
}
