using System.Diagnostics;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using WUCharts.Models;
using WURequest.Services;

namespace WUCharts.Controllers
{
    public class HomeController : Controller
    {
        private readonly ObservationsService _observationsService;

        public HomeController(ObservationsService observationsService)
        {
            _observationsService = observationsService;
        }
        public IActionResult Index()
        {
            var model = _observationsService.Latest().FirstOrDefault();
            return View(model);
        }

        public IActionResult About()
        {
            ViewData["Message"] = "This web application works with ASP.NET Core 2 and mongo db, weather is gathered from\r\n" +
                                  "a meteobridge device, fed into the database via HTTP and then parsed as a JSON object\r\n" +
                                  "which is then saved in the mongo database.\r\n" +
                                  "The application then calls the database and gets the weather info to populate the model.\r\n" +
                                  "The charts are drawn using amcharts\r\n" +
                                  "Build from first principles";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        public class AgeInfo
        {

            public string age;
            public int population;

            public AgeInfo(string prmAge, int prmPop)
            {
                this.age = prmAge;
                this.population = prmPop;
            }

        }
        public IActionResult Hour()
        {
            var model = _observationsService.Hourly();
            return View(model);
        }

        public IActionResult Day()
        {
            var model = _observationsService.Daily();
            return View(model);
        }

        public IActionResult Week()
        {
            var model = _observationsService.Weekly();
            return View(model);
        }
        public IActionResult Month()
        {
            var model = _observationsService.Monthly();
            return View(model);
        }
    }
}
