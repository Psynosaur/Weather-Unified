using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.NodeServices;
using WUCharts.Models;

namespace WUCharts.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
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
        public async Task<IActionResult> Chart([FromServices] INodeServices nodeServices)
        {
            var options = new { width = 400, height = 200 };

            List<AgeInfo> ls = new List<AgeInfo>();
            ls.Add(new AgeInfo("<5", 2704659));
            ls.Add(new AgeInfo("5-13", 4499890));
            ls.Add(new AgeInfo("14-17", 2159981));
            ls.Add(new AgeInfo("18-24", 3853788));
            ls.Add(new AgeInfo("25-44", 14106543));
            ls.Add(new AgeInfo("45-64", 8819342));
            ls.Add(new AgeInfo("≥65", 612463));


            // string markup = await nodeServices.InvokeAsync<string>("Node/d3Pie.js", options, data);

            ViewData["ChartImage"] = await nodeServices.InvokeAsync<string>("Node/d3chart.js", options, ls);

            return View();
        }
    }
}
