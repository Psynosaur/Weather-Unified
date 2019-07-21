namespace WURequest.Models
{
    public class ObservationDatabaseSettings : IObservationDatabaseSettings
    {
        public string ObservationCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface IObservationDatabaseSettings
    {
        string ObservationCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}