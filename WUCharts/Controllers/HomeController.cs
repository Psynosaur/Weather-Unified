using System;
using System.Diagnostics;
using System.Linq;
using System.Xml;
using Microsoft.AspNetCore.Http.Features;
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

        [Route("/")]
        public IActionResult Index()

        {
            ViewData["Title"] = "Home";
            ViewData["Description"] = "Weather information for Durbanville South Africa, captured " +
                                      "using a Fine Offset WH2310 weather station and a meteobridge weather interface";
            var model = _observationsService.Latest().FirstOrDefault();
            return View(model);
        }

        [Route("/sitemap.xml")]
        public void SitemapXml()
        {
            string host = Request.Scheme + "://" + Request.Host;
            var syncIOFeature = HttpContext.Features.Get<IHttpBodyControlFeature>();
            if (syncIOFeature != null)
            {
                syncIOFeature.AllowSynchronousIO = true;
            }

            Response.ContentType = "application/xml";
            var lastUpdated = DateTime.Now;
            using (var xml = XmlWriter.Create(Response.Body, new XmlWriterSettings {Indent = true}))
            {
                xml.WriteStartDocument();
                xml.WriteStartElement("urlset", "http://www.sitemaps.org/schemas/sitemap/0.9");

                xml.WriteStartElement("url");
                xml.WriteElementString("loc", host);
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
                xml.WriteStartElement("url");
                xml.WriteElementString("loc", host + "/contact");
                xml.WriteElementString("lastmod", lastUpdated.ToString("yyyy-MM-dd"));
                xml.WriteEndElement();


                xml.WriteEndElement();
            }
        }

        [Route("/about")]
        public IActionResult About()
        {
            ViewData["Title"] = "About";
            ViewData["Description"] = "About the author of the site";
            return View();
        }

        [Route("/contact")]
        public IActionResult Contact()
        {
            ViewData["Title"] = "Contact";
            ViewData["Description"] = "Contact the author";
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
        public IActionResult Hour(int? id = null)
        {
            ViewData["Title"] = "Hour";
            ViewData["Description"] = "Hourly weather data for the day";
            if (id <= 24 && id >= 0 || id == null)
            {
                bool nulled = String.IsNullOrEmpty(id.ToString());
                if (nulled) id = DateTime.Now.Hour;
                int hour = id ?? 0;
                var model = _observationsService.Hourly(hour);
                return View(model);
            }
            else
            {
                var model = _observationsService.Hourly(0);
                return View(model);
            }
        }

        [Route("/day")]
        public IActionResult Day()
        {
            ViewData["Title"] = "Day";
            ViewData["Description"] = "Daily weather data for the day";
            var model = _observationsService.Daily();
            return View(model);
        }

        [Route("/date/{id?}")]
        public IActionResult Date(string id = null)
        {
            ViewData["Title"] = "Historical";
            ViewData["Description"] = "Historical weather data for Durbanville South Africa";
            DateTime temp;
            if (id == null) id = DateTime.Now.ToString("yyyy-MM-dd");
            if (DateTime.TryParse(id, out temp))
            {
                var model = _observationsService.Date(id);
                return View(model);
            }
            return RedirectToAction("Error");
        }

        [Route("/week")]
        public IActionResult Week()
        {
            ViewData["Title"] = "Week";
            ViewData["Description"] = "Weather data for Durbanville South Africa - past week";
            var model = _observationsService.Weekly();
            return View(model);
        }

        [Route("/month")]
        public IActionResult Month()
        {
            ViewData["Title"] = "Month";
            ViewData["Description"] = "Weather data for Durbanville South Africa - current month";
            var model = _observationsService.Monthly();
            return View(model);
        }
    }
}