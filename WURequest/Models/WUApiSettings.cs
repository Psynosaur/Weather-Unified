namespace WURequest.Models
{
    public class WUApiSettings : IWUApiSettings
    {
        public string StationId { get; set; }
        public string PAT { get; set; }
    }

    public interface IWUApiSettings
    {
        string StationId { get; set; }
        string PAT { get; set; }
    }
}


