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
        public ActionResult<JObject> Temp()
        {

            string webRootPath = _hostingEnvironment.WebRootPath;
            //var lineCount = System.IO.File.ReadLines(webRootPath + "/logs/wudata11.txt").Count();
            var list = new JObject();
            var fileitems = System.IO.File.ReadLines(webRootPath + "/logs/wudata11.txt");
            //list.Add("date\ttemp");
            foreach (var item in fileitems)
            {
                JObject jObj = JObject.Parse(item);
                var temperature = jObj["observations"][0]["metric"]["temp"].ToString();
                var time = jObj["observations"][0]["obsTimeLocal"].ToString().Split(' ').Last();
                time = time.Remove(time.Length - 3);
                list.Add(time, temperature);
            }
            return list;

        }
    }
}
