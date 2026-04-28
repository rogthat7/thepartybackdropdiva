namespace thepartybackdropdiva.Domain.Interfaces;

public interface IStorageService
{
    Task<string> UploadAsync(Stream stream, string fileName, string contentType);
}
