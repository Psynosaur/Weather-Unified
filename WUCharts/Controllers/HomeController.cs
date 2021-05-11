using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Xml;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using WUCharts.Models;
using WURequest.Models;
using WURequest.Services;

namespace WUCharts.Controllers
{
    public class HomeController : Controller
    {
        private readonly ObservationsService _observationsService;
        private readonly ForecastService _forecastService;
        private readonly IOptions<AppSettings> _appSettings;


        public HomeController(ObservationsService observationsService, ForecastService forecastService,
            IOptions<AppSettings> appSettings)
        {
            _observationsService = observationsService;
            _forecastService = forecastService;
            _appSettings = appSettings;
        }

        [Route("/forecast")]
        public IActionResult Forecast()
        {
            ViewData["Title"] = $"{_appSettings.Value.StationName} - Weather Forecast";
            ViewData["Description"] = "Six day weather forecast";
            var model = _forecastService.Latest().Result.FirstOrDefault();
            return View(model);
        }

        [Route("/")]
        public IActionResult Index()

        {
            return RedirectToAction("Day");
        }

        [Route("/sitemap.xml")]
        public void SitemapXml()
        {
            string host = Request.Scheme + "://" + Request.Host;
            IHttpBodyControlFeature syncIoFeature = HttpContext.Features.Get<IHttpBodyControlFeature>();
            if (syncIoFeature != null)
            {
                syncIoFeature.AllowSynchronousIO = true;
            }

            Response.ContentType = "application/xml";
            var lastUpdated = DateTime.Now;
            using var xml = XmlWriter.Create(Response.Body, new XmlWriterSettings {Indent = true});
            xml.WriteStartDocument();
            xml.WriteStartElement("urlset", "http://www.sitemaps.org/schemas/sitemap/0.9");

            xml.WriteStartElement("url");
            xml.WriteElementString("loc", host);
            xml.WriteElementString("lastmod", lastUpdated.ToString("yyyy-MM-dd"));
            xml.WriteEndElement();
            xml.WriteStartElement("url");
            xml.WriteElementString("loc", host + "/forecast");
            xml.WriteElementString("lastmod", lastUpdated.ToString("yyyy-MM-dd"));
            xml.WriteEndElement();
            xml.WriteStartElement("url");
            xml.WriteElementString("loc", host + "/hour");
            xml.WriteElementString("lastmod", lastUpdated.ToString("yyyy-MM-dd"));
            xml.WriteEndElement();
            xml.WriteStartElement("url");
            xml.WriteElementString("loc", host + "/day");
            xml.WriteElementString("lastmod", lastUpdated.ToString("yyyy-MM-dd"));
            xml.WriteEndElement();
            xml.WriteStartElement("url");
            xml.WriteElementString("loc", host + "/week");
            xml.WriteElementString("lastmod", lastUpdated.ToString("yyyy-MM-dd"));
            xml.WriteEndElement();
            xml.WriteStartElement("url");
            xml.WriteElementString("loc", host + "/month");
            xml.WriteElementString("lastmod", lastUpdated.ToString("yyyy-MM-dd"));
            xml.WriteEndElement();
            xml.WriteStartElement("url");
            xml.WriteElementString("loc", host + "/date");
            xml.WriteElementString("lastmod", lastUpdated.ToString("yyyy-MM-dd"));
            xml.WriteEndElement();
            xml.WriteStartElement("url");
            xml.WriteElementString("loc", host + "/about");
            xml.WriteElementString("lastmod", lastUpdated.ToString("yyyy-MM-dd"));
            xml.WriteEndElement();
            // xml.WriteStartElement("url");
            // xml.WriteElementString("loc", host + "/contact");
            // xml.WriteElementString("lastmod", lastUpdated.ToString("yyyy-MM-dd"));
            // xml.WriteEndElement();


            xml.WriteEndElement();
        }

        [Route("/about")]
        public IActionResult About()
        {
            ViewData["Title"] = "About";
            ViewData["Description"] = "About the author of the site";
            return View();
        }

        //[Route("/contact")]
        // public IActionResult Contact()
        // {
        //     ViewData["Title"] = "Contact";
        //     ViewData["Description"] = "Contact the author";
        //     return View();
        // }

        public IActionResult Privacy()
        {
            return View();
        }

        [Route("/error")]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel {RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier});
        }

        [Route("/hour/{id?}")]
        public IActionResult Hour(int? id = null)
        {
            ViewData["Title"] = "Hour";
            ViewData["Description"] = "Live Hourly weather data for the day";
            switch (id)
            {
                case <= 24 and >= 0:
                case null:
                {
                    bool nulled = String.IsNullOrEmpty(id.ToString());
                    if (nulled) id = DateTime.Now.Hour;
                    int hour = id ?? 0;
                    List<Observations> model = _observationsService.Hourly(hour).Result;
                    return View(model);
                }
                default:
                {
                    List<Observations> model = _observationsService.Hourly(0).Result;
                    return View(model);
                }
            }
        }

        [Route("/day")]
        public IActionResult Day()
        {
            ViewData["Title"] = $"{_appSettings.Value.StationName} {_appSettings.Value.Country} - Weather Today";
            ViewData["Description"] =
                $"Weather information for {_appSettings.Value.StationName} {_appSettings.Value.Country}, captured " +
                $"using a {_appSettings.Value.WeatherStation} weather station";
            List<Observations> model = _observationsService.Daily().Result;
            return View(model);
        }

        [Route("/date/{id?}")]
        public IActionResult Date(string id = null)
        {
            ViewData["Title"] = $"{_appSettings.Value.StationName} {_appSettings.Value.Country} - Past records";
            ViewData["Description"] =
                $"Historical weather data for {_appSettings.Value.StationName} {_appSettings.Value.Country}";
            if (id == null)
            {
                List<Observations> model = _observationsService.Daily().Result;
                return View(model);
            }

            if (DateTime.TryParse(id, out _))
            {
                List<Observations> model = _observationsService.Date(id).Result;
                return View(model);
            }

            return RedirectToAction("Error");
        }

        [Route("/rain")]
        public IActionResult Rain(string start, string end)
        {
            ViewData["Title"] = "Rain";
            ViewData["Description"] = $"Rain data for {_appSettings.Value.StationName} - {_appSettings.Value.Country}";
            List<List<RainObs>> model = _observationsService.Rain(start, end);
            return View(model);
        }

        [Route("/week")]
        public IActionResult Week()
        {
            ViewData["Title"] = $"{_appSettings.Value.StationName} {_appSettings.Value.Country} - past week";
            ViewData["Description"] =
                $"Weather data for {_appSettings.Value.StationName} - {_appSettings.Value.Country} - past week";
            List<Observations> model = _observationsService.Weekly().Result;
            return View(model);
        }

        [Route("/month")]
        public IActionResult Month()
        {
            ViewData["Title"] = $"{_appSettings.Value.StationName} {_appSettings.Value.Country} - past month";
            ViewData["Description"] =
                $"Weather data for {_appSettings.Value.StationName} - {_appSettings.Value.Country} - past month";
            List<Observations> model = _observationsService.Monthly().Result;
            return View(model);
        }
    }
}