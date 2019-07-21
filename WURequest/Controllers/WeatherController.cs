using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
        private readonly ObservationService _observationService;

        public WeatherController(
            ObservationService observationService,
            IHostingEnvironment hostingEnvironment)
        {
            _observationService = observationService;
            _hostingEnvironment = hostingEnvironment;
        }

        // Meteobridge Data getter
        // Parses string from Meteobridge HTTP Get
        [HttpGet]
        public ActionResult<string> Mb(string data)
        {
            try
            {
                JObject json = JObject.Parse(data);
                //Creates MongoDb entry JObject to Observation Model
                if (json.ContainsKey("DateTime"))
                {
                    _observationService.Create(json.ToObject<Observation>());
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
        public async Task<ActionResult<string>> GetAsync(string id, string pat)
        {
            try
            {
                var format = "json";
                var units = 'm';
                string webRootPath = _hostingEnvironment.WebRootPath;

                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Accept.Add(
                        new MediaTypeWithQualityHeaderValue("application/json"));

                    using (HttpResponseMessage response = await client.GetAsync(
                        string.Format("https://api.weather.com/v2/pws/observations/current?stationId={0}&format={1}&units={2}&apiKey={3}", id, format, units, pat)))
                    {
                        try
                        {
                            response.EnsureSuccessStatusCode();
                            string responseBody = await response.Content.ReadAsStringAsync();
                            using (StreamWriter outputFile = new StreamWriter(Path.Combine(webRootPath + "/logs/wudata11.txt"), append: true))
                            {
                                await outputFile.WriteAsync(responseBody);
                            }
                            return responseBody;
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

// GET api/values
//
//File Out
//string webRootPath = _hostingEnvironment.WebRootPath;
//using (StreamWriter outputFile = new StreamWriter(Path.Combine(webRootPath + "/logs/wudata11.txt"), append: true))
//{
//    //await outputFile.WriteAsync(responseBody);
//    await outputFile.WriteLineAsync(str);
//}


