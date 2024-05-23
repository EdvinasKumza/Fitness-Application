using Microsoft.EntityFrameworkCore;
using EntityFrameworkCore.MySQL.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DotNetEnv;
using Microsoft.Extensions.DependencyModel;
using FitnessApp.Services;
using FitnessApp.Repositories;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

var logFilePath = configuration["Logging:FileLogging:Path"];
builder.Services.AddSingleton<ICustomLogger>(new CustomLogger(logFilePath));

var isLoggingEnabled = configuration.GetValue<bool>("Logging:FileLogging:Enabled");

builder.Services.AddControllers(options =>
{
    if (isLoggingEnabled)
    {
        options.Filters.Add<LoggingActionFilter>();
    }
});

var jwtSecretKey = Environment.GetEnvironmentVariable("JWT_SECRET");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "localhost:5260",
        ValidAudience = "localhost:5260",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey))
    };
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors((options) =>
{
    options.AddPolicy("CorsPolicy",
        builder =>
        {
            builder
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithOrigins("http://localhost:3000");
        });
});

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite("Data Source=FitnessDB.db");
});

builder.Services.AddDistributedMemoryCache(); // For session storage
builder.Services.AddControllersWithViews(); // Add MVC support

builder.Services.AddScoped<IWorkoutService, WorkoutService>();
builder.Services.AddScoped<IWorkoutRepository, WorkoutRepository>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
