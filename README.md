# Weather-Unified

Basic Goals of this project.
  - [x] Get JSON object form a weather network 
    - [x] Get JSON object with stationId and ApiKey from WeatherUnderground
    - [ ] Get JSON object with stationId and ApiKey from Darksky
  - [x] Get data from meteobridge device HTTP request
  - [x] Create public API Controller Action
  - [x] Fire 5 min cron job for weather data
  - [x] Save JSON object to Database
  - [x] Parse DB for relevant information ( just temp for starters )
    - [x] Make API controller action for relevant parser
  - [ ] Draw chart for temperature from DB
  - [ ] Expand home page 1st setup should do site configuration
    - [x] Create weather dashboard
  - [ ] Make sure this can be done in some container
  
### Why?
 - Simplify process of setup and deployment
 - Most weather templates are written in PHP
 - This is 2019 

###Meteobridge setup 
