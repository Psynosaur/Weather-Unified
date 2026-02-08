namespace WURequest.Models
{
    public class AppSettings : IAppSettings
    {
        public string StationName { get; set; }
        public string Country { get; set; }
        public double MagneticDeclination { get; set; }
        public double Lat { get; set; }
        public string WeatherStation { get; set; }
        public string WURequestApiUrl { get; set; }
        public int WURequestApiPort { get; set; }
        public string ApiKey { get; set; }  // API key for authenticating with WURequest API
    }

    public interface IAppSettings
    {
        public string StationName { get; set; }
        public string Country { get; set; }
        public double MagneticDeclination { get; set; }
        public double Lat { get; set; }
        public string WeatherStation { get; set; }
        public string WURequestApiUrl { get; set; }
        public int WURequestApiPort { get; set; }
        public string ApiKey { get; set; }
    }
}
