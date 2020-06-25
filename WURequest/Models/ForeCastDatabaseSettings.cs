namespace WURequest.Models
{
    public class ForecastDatabaseSettings : IForecastDatabaseSettings
    {
        public string ForecastCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface IForecastDatabaseSettings
    {
        string ForecastCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}