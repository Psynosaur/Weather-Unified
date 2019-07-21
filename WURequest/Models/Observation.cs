using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;


namespace WURequest.Models
{
    public class Observation
    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [BsonElement("DateTime")]
        [JsonProperty("DateTime")]
        public string DateTime { get; set; }
        public double TempOutCur { get; set; }
        public double Tmin { get; set; }
        public double Tmax { get; set; }
        public double HumOutCur { get; set; }
        public double PressCur { get; set; }
        public double DewCur { get; set; }
        public double HeatIdxCur { get; set; }
        public double WindChillCur { get; set; }
        public double TempInCur { get; set; }
        public double HumInCur { get; set; }
        public double WindSpeedCur { get; set; }
        public double WindAvgSpeedCur { get; set; }
        public double WindDirCur { get; set; }
        public string WindDirCurEng { get; set; }
        public double WindGust10 { get; set; }
        public double WindDirAvg10 { get; set; }
        public string WindDirAvg10Eng { get; set; }
        public double RainRateCur { get; set; }
        public double RainDay { get; set; }
        public double RainYest { get; set; }
        public double RainMonth { get; set; }
        public double RainYear { get; set; }
        // ReSharper disable once InconsistentNaming
        public double UV { get; set; }
        public double SolarRad { get; set; }
    }
}
