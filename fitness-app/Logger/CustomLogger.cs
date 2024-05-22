public interface ICustomLogger
{
    void Log(string userName, string permissions, string methodName, string className, string message);
}

public class CustomLogger : ICustomLogger
{
    private readonly string _filePath;

    public CustomLogger(string filePath)
    {
        _filePath = filePath;
    }

    public void Log(string userName, string permissions, string methodName, string className, string message)
    {
        var logMessage = $"{DateTime.UtcNow}: User={userName}, Permissions={permissions}, Class={className}, Method={methodName}, Message={message}";
        lock (_filePath)
        {
            File.AppendAllText(_filePath, logMessage + Environment.NewLine);
        }
    }
}
