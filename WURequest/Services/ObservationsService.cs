using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        public List<Observations> Get() =>
            _observation.Find(Observation => true).ToList();
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
