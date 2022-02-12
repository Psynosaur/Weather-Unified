
# Weather-Unified

This will be my attempt at a weather template for users that own a weather station.

This is application is currently usable for [Meteobridge](https://www.meteobridge.com/) users only, so that
you can have a nice dashboard for your weather station, either hosted locally
on your local area network or over the internet.
  
### How
- This will be hosted using .Net Core 3.1.5 / 5 so it can be hosted anywhere
	- WURequest is the API for getting the data from a [Meteobridge](https://www.meteobridge.com/) device into the mongodb database 
	- WUCharts will draw the charts and use the API to get it's information
	
- It will be as simple as unzipping a zip file to a directory and installing mongoDB
    - The WURequest API will create the first observation document in mongodb automagically
    - You will be required to feed further observations via Meteobridge
    
- Setup the reverse proxy app and configure your API settings

### Forecasts

You can get weather forecasts to if you are a weather underground contributor
 
### Meteobridge setup 


#### String to copy to meteobridge HTTP GET Request input field.

`https://xxx.xxx.xxx.xxx` would be the IP address of your server where this application is hosted

`https://xxx.xxx.xxx.xxx/api/weather/Mb?obsTime=[YYYY]-[MM]-[DD]T[hh]:[mm]:[ss].000%2B02:00&tempOutCur=[th0temp-act]&tmin=[th0temp-min2]&tmax=[th0temp-max2]&humOutCur=[th0hum-act]&pressCur=[thb0seapress-act]&dewCur=[th0dew-act]&heatIdxCur=[th0heatindex-act]&windChillCur=[wind0chill-act]&tempInCur=[thb0temp-act]&humInCur=[thb0hum-act]&windSpeedCur=[wind0wind-act]&windAvgSpeedCur=[wind0avgwind-act]&windDirCur=[wind0dir-act]&windDirCurEng=[wind0dir-act=endir]&windGust10=[wind0wind-max10]&windDirAvg10=[wind0dir-avg10]&windDirAvg10Eng=[wind0dir-avg10=endir]&rainRateCur=[rain0rate-act]&rainDay=[rain0total-daysum]&rainYest=[rain0total-ydaysum=]&rainMonth=[rain0total-monthsum]&rainYear=[rain0total-yearsum]&uv=[uv0index-act]&solarRad=[sol0rad-act]`

#### Please be aware of the time zone in the above string

`%2B02:00` which in my case is **UTC +2** hours replace `%2B` with `%2D` for negative time zones

This string was built using information from [here](https://www.meteobridge.com/wiki/index.php/Templates)

### Verify that everything is okay

### On the Services Events page

![Alt text](https://github.com/Psynosaur/Weather-Unified/blob/master/mb.png "Events")

### Live Data page

![Alt text](https://github.com/Psynosaur/Weather-Unified/blob/master/mbDataOk.png "Live Updates")


Check to see if HTTP Upload : Says **Data OK**