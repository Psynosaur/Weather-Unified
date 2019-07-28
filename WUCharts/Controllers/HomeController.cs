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
            ViewData["Message"] = "This will serve as a replacemet for my current weather34 template hosted on https://cptsats.co.za/pws";

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
    }
}
