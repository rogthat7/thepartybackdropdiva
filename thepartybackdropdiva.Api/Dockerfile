FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["thepartybackdropdiva.Api/thepartybackdropdiva.Api.csproj", "thepartybackdropdiva.Api/"]
COPY ["thepartybackdropdiva.Application/thepartybackdropdiva.Application.csproj", "thepartybackdropdiva.Application/"]
COPY ["thepartybackdropdiva.Infrastructure/thepartybackdropdiva.Infrastructure.csproj", "thepartybackdropdiva.Infrastructure/"]
COPY ["thepartybackdropdiva.Contracts/thepartybackdropdiva.Contracts.csproj", "thepartybackdropdiva.Contracts/"]
COPY ["thepartybackdropdiva.Domain/thepartybackdropdiva.Domain.csproj", "thepartybackdropdiva.Domain/"]
COPY ["thepartybackdropdiva.Ai/thepartybackdropdiva.Ai.csproj", "thepartybackdropdiva.Ai/"]
RUN dotnet restore "thepartybackdropdiva.Api/thepartybackdropdiva.Api.csproj"
COPY . .
WORKDIR "/src/thepartybackdropdiva.Api"
RUN dotnet build "thepartybackdropdiva.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "thepartybackdropdiva.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "thepartybackdropdiva.Api.dll"]
