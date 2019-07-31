
# Weather-Unified

This will be my attempt at a weather template for users that own a weather station.
This is usable especially for [Meteobridge](https://www.meteobridge.com/) users, but the idea here is to grab data 
from Weather Underground as well as other weather services, so that
you can have a nice dashboard for your weather station, either hosted locally
on your local area network or over the internet.
  
### Why?
 - Simplify process of setup and deployment
### How
- This will be hosted on IIS on your local/public server
	- WURequest is the API for getting the data into the database 
	- WUCharts will draw the charts 
- It will be as simple as unzipping a zip file to a directory and installing mongoDB
- Setup the IIS app and configure your API settings if using an external data source
- I will document this setup process nicely  ¯\\_(ツ)\_/¯
- Huzzah
 
### Meteobridge setup 

#### String to copy to meteobridge HTTP GET Request input field.
`https://xxx.xxx.xxx.xxx` would be the IP address of your server where this application is hosted

`https://xxx.xxx.xxx.xxx/api/weather/Mb?data={%22DateTime%22:%22[YYYY]-[MM]-[DD]T[hh]:[mm]:[ss].000%2B02:00%22,%22TempOutCur%22:[th0temp-act],%22Tmin%22:[th0temp-min2],%22Tmax%22:[th0temp-max2],%22HumOutCur%22:[th0hum-act],%22PressCur%22: [thb0seapress-act],%22DewCur%22: [th0dew-act],%22HeatIdxCur%22: [th0heatindex-act],%22WindChillCur%22: [wind0chill-act],%22TempInCur%22:[thb0temp-act],%22HumInCur%22:[thb0hum-act],%22WindSpeedCur%22:[wind0wind-act],%22WindAvgSpeedCur%22: [wind0avgwind-act],%22WindDirCur%22:[wind0dir-act],%22WindDirCurEng%22:%22[wind0dir-act=endir]%22,%22WindGust10%22:[wind0wind-max10],%22WindDirAvg10%22:[wind0dir-avg10],%22WindDirAvg10Eng%22:%22[wind0dir-avg10=endir]%22,%22RainRateCur%22:[rain0rate-act],%22RainDay%22:[rain0total-daysum],%22RainYest%22:[rain0total-ydaysum=],%22RainMonth%22: [rain0total-monthsum],%22RainYear%22:[rain0total-yearsum],%22UV%22:[uv0index-act],%22SolarRad%22:[sol0rad-act]}`

#### Please be aware of the time zone in the above string on the 2nd line 

`[ss].000`**%2B02:00**`%22` which in my case is **UTC +2** hours replace `%2B` with `%2D` for negative time zones

This string was built using information from [here](https://www.meteobridge.com/wiki/index.php/Templates)

More updates to follow 
