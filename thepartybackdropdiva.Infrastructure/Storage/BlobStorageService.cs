using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Configuration;
using thepartybackdropdiva.Domain.Interfaces;

namespace thepartybackdropdiva.Infrastructure.Storage;

public class BlobStorageService : IStorageService
{
    private readonly string _connectionString;
    private readonly string _containerName = "backdrops";

    public BlobStorageService(IConfiguration configuration)
    {
        // For local Azurite, use "UseDevelopmentStorage=true"
        _connectionString = configuration.GetConnectionString("AzureStorage") ?? "UseDevelopmentStorage=true";
        _containerName = configuration["Storage:ContainerName"] ?? "backdrops";
    }

    public async Task<string> UploadAsync(Stream stream, string fileName, string contentType)
    {
        var blobServiceClient = new BlobServiceClient(_connectionString);
        var containerClient = blobServiceClient.GetBlobContainerClient(_containerName);
        
        // Ensure container exists and is publicly accessible for reading images via URL
        await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

        var blobClient = containerClient.GetBlobClient(Guid.NewGuid() + Path.GetExtension(fileName));
        
        await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = contentType });

        // Note: For local Azurite, this will return http://127.0.0.1:10000/...
        // You might need to replace 127.0.0.1 with localhost if accessing from browser
        var uri = blobClient.Uri.ToString();
        return uri.Replace("127.0.0.1", "localhost").Replace("azurite", "localhost");
    }
}
