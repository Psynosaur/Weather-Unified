using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WURequest.Models;
using WURequest.Services;

namespace WURequest.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IObservationsService _observationsService;
        private readonly IWeatherUndergroundApiSettings _weatherUndergroundApiSettings;
        private readonly ILogger _logger;
        public WeatherController(
            IObservationsService observationsService,
            IWebHostEnvironment hostingEnvironment, 
            IWeatherUndergroundApiSettings weatherUndergroundApiSettings,
            ILoggerFactory logFactory)
        {
            _observationsService = observationsService;
            _hostingEnvironment = hostingEnvironment;
            _weatherUndergroundApiSettings = weatherUndergroundApiSettings;
            _logger = logFactory.CreateLogger<WeatherController>();
        }

        /*
            Meteobridge Data getter
            - This is where Meteobridge sends the weather data to
            - It stores the result in the mongodb
        */
        [HttpGet]
        public async Task<ActionResult<string>> Mb([FromQuery] Observations data)
        {
            try
            {
                if (data.ObsTime != default && !double.IsNaN(data.TempOutCur))
                {
                    await _observationsService.Create(data);
                    return "DATA OK";
                }
                return "DATA BAD";
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.ToString());
                throw;
            }
        }
        // Decide what to do here?
        // [HttpGet]
        // public async Task<ActionResult<string>> Wu()
        // {
        //     try
        //     {
        //         string webRootPath = _hostingEnvironment.WebRootPath;
        //
        //         using (HttpClient client = new HttpClient())
        //         {
        //             client.DefaultRequestHeaders.Accept.Add(
        //                 new MediaTypeWithQualityHeaderValue("application/json"));
        //
        //             using (HttpResponseMessage response = await client.GetAsync(
        //                 string.Format(
        //                     "https://api.weather.com/v2/pws/observations/current?stationId={0}&format={1}&units={2}&apiKey={3}",
        //                     _weatherUndergroundApiSettings.StationId, _weatherUndergroundApiSettings.Format, _weatherUndergroundApiSettings.Units, _weatherUndergroundApiSettings.Pat)))
        //             {
        //                 try
        //                 {
        //                     response.EnsureSuccessStatusCode();
        //                     string responseBody = await response.Content.ReadAsStringAsync();
        //                     using (StreamWriter outputFile =
        //                         new StreamWriter(Path.Combine(webRootPath + "/logs/wudata11.txt"), append: true))
        //                     {
        //                         await outputFile.WriteAsync(responseBody).ConfigureAwait(false);
        //                     }
        //                     JObject jObj = JObject.Parse(responseBody);
        //                     string some = jObj["observations"][0].ToString();
        //                     return some;
        //                 }
        //                 catch (Exception ex)
        //                 {
        //                     _logger.LogInformation(ex.ToString());
        //                     throw;
        //                 }
        //             }
        //         }
        //     }
        //     catch (Exception ex)
        //     {
        //         _logger.LogInformation(ex.ToString());
        //         throw;
        //     }
        // }
        //
        // // POC stuff to get JSON from flat DB
        // [Route("api/[controller]")]
        // [ApiController]
        // public class DataController : ControllerBase
        // {
        //     private readonly IWebHostEnvironment _hostingEnvironment;
        //
        //     public DataController(IWebHostEnvironment hostingEnvironment)
        //     {
        //         _hostingEnvironment = hostingEnvironment;
        //     }
        //
        //     [HttpGet]
        //     public ActionResult<JArray> Temp()
        //     {
        //
        //         string webRootPath = _hostingEnvironment.WebRootPath;
        //         var jsonArray = new JArray();
        //         var fileitems = System.IO.File.ReadLines(webRootPath + "/logs/wudata11.txt");
        //         foreach (var item in fileitems)
        //         {
        //             JObject jObj = JObject.Parse(item);
        //             jsonArray.Add(jObj[""]);
        //         }
        //
        //         return jsonArray;
        //
        //     }
        // }
    }
}


