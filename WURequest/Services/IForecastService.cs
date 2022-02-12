using System.Collections.Generic;
using System.Threading.Tasks;
using WURequest.Models;

namespace WURequest.Services
{
    public interface IForecastService
    {
        public Task<List<Forecasts>> Latest();

        public Task Create(Forecasts fc);

    }
}