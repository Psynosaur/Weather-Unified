
using System.Collections.Generic;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace WURequest.Models
{
    public class Forecasts
    {
        [BsonId]
        [BsonElement("_id")]
        public ObjectId ObjectId { get; set; }
        
        [BsonElement("calendarDayTemperatureMax")] public List<long?> calendarDayTemperatureMax { get; set; }
        
        [BsonElement("calendarDayTemperatureMin")] public List<long?> calendarDayTemperatureMin { get; set; }
        [BsonElement("dayOfWeek")] public List<string> DayOfWeek { get; set; }

        [BsonElement("expirationTimeUtc")] public List<long?> ExpirationTimeUtc { get; set; }

        [BsonElement("moonPhase")] public List<string> MoonPhase { get; set; }

        [BsonElement("moonPhaseCode")] public List<string> MoonPhaseCode { get; set; }

        [BsonElement("moonPhaseDay")] public List<long?> MoonPhaseDay { get; set; }

        [BsonElement("moonriseTimeLocal")] public List<string> MoonriseTimeLocal { get; set; }

        [BsonElement("moonriseTimeUtc")] public List<long?> MoonriseTimeUtc { get; set; }

        [BsonElement("moonsetTimeLocal")] public List<string> MoonsetTimeLocal { get; set; }

        [BsonElement("moonsetTimeUtc")] public List<long?> MoonsetTimeUtc { get; set; }

        [BsonElement("narrative")] public List<string> Narrative { get; set; }

        [BsonElement("qpf")] public List<double?> Qpf { get; set; }

        [BsonElement("qpfSnow")] public List<double?> QpfSnow { get; set; }

        [BsonElement("qpfIce")] public List<double?> QpfIce { get; set; }

        [BsonElement("qpfRain")] public List<double?> QpfRain { get; set; }

        [BsonElement("sunriseTimeLocal")] public List<string> SunriseTimeLocal { get; set; }

        [BsonElement("sunriseTimeUtc")] public List<long?> SunriseTimeUtc { get; set; }

        [BsonElement("sunsetTimeLocal")] public List<string> SunsetTimeLocal { get; set; }

        [BsonElement("sunsetTimeUtc")] public List<long?> SunsetTimeUtc { get; set; }

        [BsonElement("temperatureMax")] public List<long?> TemperatureMax { get; set; }

        [BsonElement("temperatureMin")] public List<long?> TemperatureMin { get; set; }

        [BsonElement("validTimeLocal")] public List<string> ValidTimeLocal { get; set; }

        [BsonElement("validTimeUtc")] public List<long?> ValidTimeUtc { get; set; }

        [BsonElement("daypart")] public List<Daypart> Daypart { get; set; }
        
    }

    public class Daypart
    {
        [BsonElement("cloudCover")] public List<long?> CloudCover { get; set; }
    
        [BsonElement("dayOrNight")] public List<char?> DayOrNight { get; set; }
    
        [BsonElement("daypartName")] public List<string> DaypartName { get; set; }
    
        [BsonElement("iconCode")] public List<long?> IconCode { get; set; }
    
        [BsonElement("iconCodeExtend")] public List<long?> IconCodeExtend { get; set; }
    
        [BsonElement("narrative")] public List<string> Narrative { get; set; }
    
        [BsonElement("precipChance")] public List<long?> PrecipChance { get; set; }
    
        [BsonElement("precipType")] public List<string> PrecipType { get; set; }
    
        [BsonElement("qpf")] public List<double?> Qpf { get; set; }
    
        [BsonElement("qpfSnow")] public List<double?> QpfSnow { get; set; }
    
        [BsonElement("qualifierCode")] public List<string> QualifierCode { get; set; }
    
        [BsonElement("qualifierPhrase")] public List<string> QualifierPhrase { get; set; }
    
        [BsonElement("relativeHumidity")] public List<long?> RelativeHumidity { get; set; }
    
        [BsonElement("snowRange")] public List<string> SnowRange { get; set; }
    
        [BsonElement("temperature")] public List<long?> Temperature { get; set; }
    
        [BsonElement("temperatureHeatIndex")] public List<long?> TemperatureHeatIndex { get; set; }
    
        [BsonElement("temperatureWindChill")] public List<long?> TemperatureWindChill { get; set; }
    
        [BsonElement("thunderCategory")] public List<string> ThunderCategory { get; set; }
    
        [BsonElement("thunderIndex")] public List<long?> ThunderIndex { get; set; }
    
        [BsonElement("uvDescription")] public List<string> UvDescription { get; set; }
    
        [BsonElement("uvIndex")] public List<long?> UvIndex { get; set; }
    
        [BsonElement("windDirection")] public List<long?> WindDirection { get; set; }
    
        [BsonElement("windDirectionCardinal")]
        public List<string> WindDirectionCardinal { get; set; }
    
        [BsonElement("windPhrase")] public List<string> WindPhrase { get; set; }
    
        [BsonElement("windSpeed")] public List<long?> WindSpeed { get; set; }
    
        [BsonElement("wxPhraseLong")] public List<string> WxPhraseLong { get; set; }
    
        [BsonElement("wxPhraseShort")] public List<string> WxPhraseShort { get; set; }
    }
} 