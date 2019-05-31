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

namespace WURequest.Controllers
{
//     public class Metrics
//     {
//         public string TempOutCur { get; set; }
//         public string Tmin { get; set; }
//         public string Tmax { get; set; }
//         public string HumOutCur { get; set; }
//         public string PressCur { get; set; }
//         public string DewCur { get; set; }
//         public string HeatIdxCur { get; set; }
//         public string WindChillCur { get; set; }
//         public string TempInCur { get; set; }
//         public string HumInCur { get; set; }
//         public string WindSpeedCur { get; set; }
//         public string WindAvgSpeedCur { get; set; }
//         public string WindDirCur { get; set; }
//         public string WindDirCurEng { get; set; }
//         public string WindGust10 { get; set; }
//         public string WindDirAvg10 { get; set; }
//         public string WindDirAvg10Eng { get; set; }
//         public string RainRateCur { get; set; }
//         public string RainDay { get; set; }
//         public string RainYest { get; set; }
//         public string RainMonth { get; set; }
//         public string RainYear { get; set; }
//         public string UV { get; set; }
//         public string Solar_Rad { get; set; }
//     }

//     public class Meteobridge
//     {
//         public string DateTime { get; set; }
//         public Metrics metrics { get; set; }
//     }

//     public class RootObject
//     {
//         public List<Meteobridge> meteobridge { get; set; }
//     }
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly IHostingEnvironment _hostingEnvironment;

        public ValuesController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        // GET api/values
        [HttpGet]
        public async Task<ActionResult<string>> GetAsync()
        {
            try
            {
                var stationId = "IKRAAIFO3";
                var format = "json";
                var units = 'm';
                var personalaccesstoken = "d4748acffd2e4d8ab48acffd2e7d8abc";
                string webRootPath = _hostingEnvironment.WebRootPath;

                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Accept.Add(
                        new MediaTypeWithQualityHeaderValue("application/json"));

                    using (HttpResponseMessage response = await client.GetAsync(
                                string.Format("https://api.weather.com/v2/pws/observations/current?stationId={0}&format={1}&units={2}&apiKey={3}", stationId, format, units, personalaccesstoken)))
                    {
                        try
                        {
                            response.EnsureSuccessStatusCode();
                            string responseBody = await response.Content.ReadAsStringAsync();
                            using (StreamWriter outputFile = new StreamWriter(Path.Combine(webRootPath + "/logs/wudata11.txt"), append: true))
                            {
                                await outputFile.WriteLineAsync(responseBody);
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
            var json = new JArray();
            var fileitems = System.IO.File.ReadLines(webRootPath + "/logs/wudata11.txt");
            foreach (var item in fileitems)
            {
                JObject jObj = JObject.Parse(item);
                json.Add(new JObject()
                {
                    {"time", jObj["observations"][0]["obsTimeUtc"] },
                    {"temp", jObj["observations"][0]["metric"]["temp"] }
                    });
            }
            return json;

        }
    }
}
