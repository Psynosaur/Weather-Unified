namespace WURequest.Models
{
    public class AppSettings : IAppSettings
    {
        public string StationName { get; set; }
        public double MagneticDeclination { get; set; }

        public double Lat { get; set; }
    }

    public interface IAppSettings
    {
        public string StationName { get; set; }
        public double MagneticDeclination { get; set; }
        public double Lat { get; set; }
    }
}