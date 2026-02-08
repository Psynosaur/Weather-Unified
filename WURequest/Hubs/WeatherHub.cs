using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using WURequest.Models;

namespace WURequest.Hubs
{
    public class WeatherHub : Hub
    {
        /// <summary>
        /// Broadcasts new forecast data to all connected clients
        /// </summary>
        public async Task BroadcastForecastUpdate(Forecasts forecast)
        {
            await Clients.All.SendAsync("ReceiveForecastUpdate", forecast);
        }

        /// <summary>
        /// Broadcasts new observation data to all connected clients
        /// </summary>
        public async Task BroadcastObservationUpdate(Observations observation)
        {
            await Clients.All.SendAsync("ReceiveObservationUpdate", observation);
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            // Log connection if needed
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
            // Log disconnection if needed
        }
    }
}
