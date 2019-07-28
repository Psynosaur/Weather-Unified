using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;


namespace WURequest.Models
{
    public class Observations
    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [BsonElement("DateTime")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        [BsonRepresentation(BsonType.DateTime)]
        public DateTime ObsTime { get; set; } 
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
    public class Metric
    {
        public int temp { get; set; }
        public int heatIndex { get; set; }
        public int dewpt { get; set; }
        public int windChill { get; set; }
        public int windSpeed { get; set; }
        public int windGust { get; set; }
        public double pressure { get; set; }
        public double precipRate { get; set; }
        public double precipTotal { get; set; }
        public int elev { get; set; }
    }

    public class WUObservations
    {
        public string stationID { get; set; }
        public DateTime obsTimeUtc { get; set; }
        public string obsTimeLocal { get; set; }
        public string neighborhood { get; set; }
        public string softwareType { get; set; }
        public string country { get; set; }
        public double solarRadiation { get; set; }
        public double lon { get; set; }
        public object realtimeFrequency { get; set; }
        public int epoch { get; set; }
        public double lat { get; set; }
        public double uv { get; set; }
        public int winddir { get; set; }
        public int humidity { get; set; }
        public int qcStatus { get; set; }
        public Metric metric { get; set; }
    }
}
