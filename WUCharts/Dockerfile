FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["WUCharts.csproj", ""]
RUN dotnet restore "WUCharts.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet build "WUCharts.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "WUCharts.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "WUCharts.dll"]
