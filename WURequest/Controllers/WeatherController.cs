using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using WURequest.Models;
using WURequest.Services;

namespace WURequest.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly ObservationsService _observationsService;
        public WeatherController(
            ObservationsService observationsService,
            IHostingEnvironment hostingEnvironment)
        {
            _observationsService = observationsService;
            _hostingEnvironment = hostingEnvironment;
        }

        // Meteobridge Data getter
        // Parses string from Meteobridge HTTP Get
        [HttpGet]
        public ActionResult<string> Mb(string data)
        {
            /*
             This is the Meteobridge TEST string copy from
             <<<<<<<There all the way to the last "}" then paste 
             https://localhost:5001/api/weather/Mb?data=
             {
                %22DateTime%22:%222019-09-19%2020:58:23%22,
                %22TempOutCur%22:17.4,
                %22Tmin%22:9.4,
                %22Tmax%22:19.4,
                %22HumOutCur%22:95.0,
                %22PressCur%22:1020.4,
                %22DewCur%22:14.6,
                %22HeatIdxCur%22:15.4,
                %22WindChillCur%22:15.4,
                %22TempInCur%22:18.4,
                %22HumInCur%22:73.0,
                %22WindSpeedCur%22:5.6,
                %22WindAvgSpeedCur%22:4.6,
                %22WindDirCur%22:322.0,
                %22WindDirCurEng%22:%22NW%22,
                %22WindGust10%22:9.0,
                %22WindDirAvg10%22:335.0,
                %22WindDirAvg10Eng%22:%22NNW%22,
                %22RainRateCur%22:0.0,
                %22RainDay%22:3.9,
                %22RainYest%22:0.0,
                %22RainMonth%22:54.0,
                %22RainYear%22:219.0,
                %22UV%22:0.0,
                %22SolarRad%22:0.0} 
             */
            try
            {
                JObject json = JObject.Parse(data);
                //Creates MongoDb entry JObject to Observations Model 
                if (json.ContainsKey("DateTime") && json.ContainsKey("TempOutCur"))
                {
                    _observationsService.Create(json.ToObject<Observations>());
                    return "DATA OK";
                }

                return "DATA BAD";
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
        }

        [HttpGet]
        public async Task<ActionResult<string>> Wu(string id, string pat)
        {
            try
            {
                if (id == null || pat == null)
                    return "StationId and or Personal access token is empty";
                var format = "json";
                var units = 'm';
                string webRootPath = _hostingEnvironment.WebRootPath;

                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Accept.Add(
                        new MediaTypeWithQualityHeaderValue("application/json"));

                    using (HttpResponseMessage response = await client.GetAsync(
                        string.Format(
                            "https://api.weather.com/v2/pws/observations/current?stationId={0}&format={1}&units={2}&apiKey={3}",
                            id, format, units, pat)))
                    {
                        try
                        {
                            response.EnsureSuccessStatusCode();
                            string responseBody = await response.Content.ReadAsStringAsync();
                            using (StreamWriter outputFile =
                                new StreamWriter(Path.Combine(webRootPath + "/logs/wudata11.txt"), append: true))
                            {
                                await outputFile.WriteAsync(responseBody);
                            }
                            JObject jObj = JObject.Parse(responseBody);
                            string some = jObj["observations"][0].ToString();
                            return some;
                        }
                        catch (Exception e)
                        {
                            Console.WriteLine(e.ToString());
                        }

                        return "NO DATA";
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
        }

        // POC stuff to get JSON from flat DB
        [Route("api/[controller]")]
        [ApiController]
        public class DataController : ControllerBase
        {
            private readonly IHostingEnvironment _hostingEnvironment;

            public DataController(IHostingEnvironment hostingEnvironment)
            {
                _hostingEnvironment = hostingEnvironment;
            }

            [HttpGet]
            public ActionResult<JArray> Temp()
            {

                string webRootPath = _hostingEnvironment.WebRootPath;
                var jsonArray = new JArray();
                var fileitems = System.IO.File.ReadLines(webRootPath + "/logs/wudata11.txt");
                foreach (var item in fileitems)
                {
                    JObject jObj = JObject.Parse(item);
                    jsonArray.Add(jObj[""]);
                }

                return jsonArray;

            }
        }
    }
}

// GET api/values
//
//File Out
//string webRootPath = _hostingEnvironment.WebRootPath;
//using (StreamWriter outputFile = new StreamWriter(Path.Combine(webRootPath + "/logs/wudata11.txt"), append: true))
//{
//    //await outputFile.WriteAsync(responseBody);
//    await outputFile.WriteLineAsync(str);
//}


