using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.NodeServices;
using WUCharts.Models;
using WURequest.Models;
using WURequest.Services;

namespace WUCharts.Controllers
{
    public class HomeController : Controller
    {
        private readonly ObservationService _observationService;

        public HomeController(ObservationService observationService)
        {
            _observationService = observationService;
        }
        public IActionResult Index()
        {
            var model = _observationService.Latest().FirstOrDefault();
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


        // https://gunnarpeipman.com/aspnet/aspnet-core-node-d3js/
        public IActionResult Chart([FromServices] INodeServices nodeServices)
        {
            var model = _observationService.Latest().FirstOrDefault();

            return View(model);
        }
    }
}
