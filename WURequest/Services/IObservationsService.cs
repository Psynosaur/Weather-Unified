using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using WURequest.Models;

namespace WURequest.Services
{
    public interface IObservationsService
    {
        public Task<List<Observations>> Hourly(int id);

        public Task<List<Observations>> Daily();

        public Task<List<Observations>> Date(string date);

        public Task<List<Observations>> Weekly();

        public List<List<RainObs>> Rain(string start, string end);

        public Task<List<Observations>> Monthly();

        public Task<List<Observations>> Latest();
        
        public long Count();

        public Task<IAsyncCursor<Observations>> Get(string id);

        public Task Create(Observations observation);

        public void Update(string id, Observations observationsIn);

        public void Remove(string id);
    }

}