FROM mcr.microsoft.com/dotnet/core/aspnet:2.1-stretch-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:2.1-stretch AS build
WORKDIR /src
COPY ["WUCharts/WUCharts.csproj", "WUCharts/"]
RUN dotnet restore "WUCharts/WUCharts.csproj"
COPY . .
WORKDIR "/src/WUCharts"
RUN dotnet build "WUCharts.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "WUCharts.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "WUCharts.dll"]