using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Xml;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using WUCharts.Models;
using WUCharts.Services;
using WURequest.Models;

namespace WUCharts.Controllers
{
    public class HomeController : Controller
    {
        private readonly IWeatherApiService _weatherApiService;
        private readonly IOptions<AppSettings> _appSettings;

        public HomeController(
            IWeatherApiService weatherApiService,
            IOptions<AppSettings> appSettings)
        {
            _weatherApiService = weatherApiService;
            _appSettings = appSettings;
        }

        [Route("/forecast")]
        public async System.Threading.Tasks.Task<IActionResult> Forecast()
        {
            ViewData["Title"] = $"{_appSettings.Value.StationName} - Weather Forecast";
            ViewData["Description"] = "Six day weather forecast";
            var model = await _weatherApiService.GetLatestForecastAsync();
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

            xml.WriteEndElement();
        }

        [Route("/about")]
        public IActionResult About()
        {
            ViewData["Title"] = "About";
            ViewData["Description"] = "About the author of the site";
            return View();
        }

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
        public async System.Threading.Tasks.Task<IActionResult> Hour(int? id = null)
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
                    List<Observations> model = await _weatherApiService.GetHourlyObservationsAsync(hour);
                    return View(model);
                }
                default:
                {
                    List<Observations> model = await _weatherApiService.GetHourlyObservationsAsync(0);
                    return View(model);
                }
            }
        }

        [Route("/day")]
        public async System.Threading.Tasks.Task<IActionResult> Day()
        {
            ViewData["Title"] = $"{_appSettings.Value.StationName} {_appSettings.Value.Country} - Weather Today";
            ViewData["Description"] =
                $"Weather information for {_appSettings.Value.StationName} {_appSettings.Value.Country}, captured " +
                $"using a {_appSettings.Value.WeatherStation} weather station";
            List<Observations> model = await _weatherApiService.GetDailyObservationsAsync();
            return View(model);
        }

        [Route("/date/{id?}")]
        public async System.Threading.Tasks.Task<IActionResult> Date(string id = null)
        {
            ViewData["Title"] = $"{_appSettings.Value.StationName} {_appSettings.Value.Country} - Past records";
            ViewData["Description"] =
                $"Historical weather data for {_appSettings.Value.StationName} {_appSettings.Value.Country}";
            if (id == null)
            {
                List<Observations> model = await _weatherApiService.GetDailyObservationsAsync();
                return View(model);
            }

            if (DateTime.TryParse(id, out _))
            {
                List<Observations> model = await _weatherApiService.GetObservationsByDateAsync(id);
                return View(model);
            }

            return RedirectToAction("Error");
        }

        [Route("/rain")]
        public async System.Threading.Tasks.Task<IActionResult> Rain(string start, string end)
        {
            ViewData["Title"] = "Rain";
            ViewData["Description"] = $"Rain data for {_appSettings.Value.StationName} - {_appSettings.Value.Country}";
            List<List<RainObs>> model = await _weatherApiService.GetRainDataAsync(start, end);
            return View(model);
        }

        [Route("/week/{id?}")]
        public async System.Threading.Tasks.Task<IActionResult> Week(string id = null)
        {
            ViewData["Title"] = $"{_appSettings.Value.StationName} {_appSettings.Value.Country} - past week";
            ViewData["Description"] =
                $"Weather data for {_appSettings.Value.StationName} - {_appSettings.Value.Country} - past week";
            
            // Store the current date for navigation
            DateTime currentDate;
            if (!string.IsNullOrEmpty(id) && DateTime.TryParse(id, out currentDate))
            {
                ViewData["CurrentDate"] = currentDate.ToString("yyyy-MM-dd");
            }
            else
            {
                ViewData["CurrentDate"] = DateTime.Now.ToString("yyyy-MM-dd");
            }
            
            List<Observations> model = await _weatherApiService.GetWeeklyObservationsAsync(id);
            return View(model);
        }

        [Route("/month/{id?}")]
        public async System.Threading.Tasks.Task<IActionResult> Month(string id = null)
        {
            ViewData["Title"] = $"{_appSettings.Value.StationName} {_appSettings.Value.Country} - past month";
            ViewData["Description"] =
                $"Weather data for {_appSettings.Value.StationName} - {_appSettings.Value.Country} - past month";
            
            // Store the current date for navigation
            DateTime currentDate;
            if (!string.IsNullOrEmpty(id) && DateTime.TryParse(id, out currentDate))
            {
                ViewData["CurrentDate"] = currentDate.ToString("yyyy-MM-dd");
            }
            else
            {
                ViewData["CurrentDate"] = DateTime.Now.ToString("yyyy-MM-dd");
            }
            
            List<Observations> model = await _weatherApiService.GetMonthlyObservationsAsync(id);
            return View(model);
        }
    }
}
