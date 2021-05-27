namespace WURequest.Models
{
    public class WeatherUndergroundApiSettings : IWeatherUndergroundApiSettings
    {
        public string StationId { get; set; }
        public string Pat { get; set; }
        public string Lat { get; set; }
        public string Lon { get; set; }
        public char Units { get; set; }
        public string Format { get; set; }
        public string Language { get; set; }
    }

    public interface IWeatherUndergroundApiSettings
    {
        string StationId { get; set; }
        string Pat { get; set; }
        string Lat { get; set; }
        string Lon { get; set; }
        char Units { get; set; }
        string Format { get; set; }
        string Language { get; set; }
    }
}


