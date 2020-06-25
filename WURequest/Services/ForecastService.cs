using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using WURequest.Models;

namespace WURequest.Services
{
    public class ForecastService
    {
        private readonly IMongoCollection<BsonDocument> _forecast;

        public ForecastService(IForecastDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _forecast = database.GetCollection<BsonDocument>(settings.ForecastCollectionName);
        }

        
        
        public async Task<List<BsonDocument>> Latest() =>
            await _forecast
                .Find(doc => true)
                .Limit(1)
                .Sort("{$natural:-1}").ToListAsync();

        public BsonDocument Get() =>
            _forecast.Find(observation => true).FirstOrDefault();

        public async Task<BsonDocument> Create(BsonDocument fc)
        {
            
            // var collection = database.GetCollection<BsonDocument>("test_collection");
            // await collection.InsertOneAsync(document);
            await _forecast.InsertOneAsync(fc);
            
            return fc;
        }

        // public void Update(string id, Forecast observationsIn) =>
        //     _observation.ReplaceOne(observation => observation.Id == id, observationsIn);
        //
        // public void Remove(Forecast observationsIn) =>
        //     _observation.DeleteOne(observation => observation.Id == observationsIn.Id);
        //
        // public void Remove(string id) =>
        //     _observation.DeleteOne(observation => observation.Id == id);
    }
}