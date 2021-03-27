using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace WURequest.Models
{
    public class ArduinoObservation
    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [BsonElement("DateTime")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        [BsonRepresentation(BsonType.DateTime)]
        [JsonProperty("DateTime")]
        public DateTime ObsTime { get; set; } = DateTime.UtcNow;
        public double bmp280temp { get; set; }
        public double bmp280abspressure { get; set; }
        public double bmp280relpressure { get; set; }
        public double bmp280humidity { get; set; }
        public double mlxambtemp { get; set; }
        public double mlxskytemp { get; set; }
        public double dht1temp { get; set; }
        public double dht1hum { get; set; }
        // public double dht2temp { get; set; }
        // public double dht2hum { get; set; }
        public double avgtemp { get ; set; } 
        public double avghum { get; set; }
        public double dewpoint { get; set; }
        public int co2 { get; set; }
        public int tvoc { get; set; }
        public double lienergy { get; set; } = 0.0;
        public double lidistance { get; set; } = 0.0;
        public double groundtemp { get; set; } = 0.0;
        public double groundmoisture { get; set; } = 0.0;
        public string Note { get; set; } = "";
        public double bmp280temp_2 { get; set; }
        public double bmp280abspressure_2 { get; set; }
        public double bmp280relpressure_2 { get; set; }
        public double bmp280humidity_2 { get; set; }
        public double coverage { get; set; }
    }
    
    
   
}
