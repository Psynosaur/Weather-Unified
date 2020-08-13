namespace WURequest.Models
{
    public class ArduinoDatabaseSettings : IArduinoDatabaseSettings
    {
        public string ArduinoCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface IArduinoDatabaseSettings
    {
        string ArduinoCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}