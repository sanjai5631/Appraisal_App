using EAA.Domain.Models;
using EAA.Infrastructure.Logic.EmployeeDetails;
using EAA.Application;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using EAA.Infrastructure.Logic.Auth;
using EAA.Services.Services.EmployeeDetails;
using EAA.Infrastructure.Logic.Cycle;
using EAA.Infrastructure.Logic.Appraisal;
using EAA.Services.Services.Cycle;
using EAA.Services.Services.Appraisal;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database connection (PostgreSQL)
var connectionString = builder.Configuration.GetConnectionString("ConnectionString");
builder.Services.AddDbContext<DbAppraisalContext>(options =>
    options.UseNpgsql(connectionString)
);

// Register ErrorHandler as singleton
builder.Services.AddSingleton<ErrorHandler>(sp =>
{
    var env = sp.GetRequiredService<IWebHostEnvironment>();
    var logPath = Path.Combine(env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot"), "logs");
    return new ErrorHandler(logPath);
});

// Register Employee infrastructure
builder.Services.AddTransient<IUser_infrastructure, User_infrastructure>();
builder.Services.AddTransient<IAuth_infrastructure, Auth_infrastructure>();
builder.Services.AddTransient<ICycle_infrastructure, Cycle_infrastructure>();
builder.Services.AddTransient<IAppraisal_infrastructure, Appraisal_infrastructure>();

builder.Services.AddTransient<IUser_Services, User_Services>();
builder.Services.AddTransient<ICycle_Services, Cycle_Services>();
builder.Services.AddTransient<IAppraisal_Services, Appraisal_Services>();


// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = true;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(secretKey),
        ClockSkew = TimeSpan.Zero 
    };
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Apply CORS before authentication
app.UseCors("AllowSpecificOrigins");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
