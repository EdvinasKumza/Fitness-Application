using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;
using System.Security.Claims;

public class LoggingActionFilter : IActionFilter
{
    private readonly ICustomLogger _logger;

    public LoggingActionFilter(ICustomLogger logger)
    {
        _logger = logger;
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
        var user = context.HttpContext.User.Identity?.Name ?? "Anonymous";
        var permissions = string.Join(",", context.HttpContext.User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value));
        var methodName = context.ActionDescriptor.DisplayName;
        var className = context.Controller.GetType().Name;

        _logger.Log(user, permissions, methodName, className, "Executing action");
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        var user = context.HttpContext.User.Identity?.Name ?? "Anonymous";
        var permissions = string.Join(",", context.HttpContext.User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value));
        var methodName = context.ActionDescriptor.DisplayName;
        var className = context.Controller.GetType().Name;

        _logger.Log(user, permissions, methodName, className, "Executed action");
    }
}
