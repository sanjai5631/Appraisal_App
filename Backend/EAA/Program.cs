using EAA.Application;
using EAA.Domain.Models;
using EAA.Infrastructure.Logic.Appraisal;
using EAA.Infrastructure.Logic.Auth;
using EAA.Infrastructure.Logic.Cycle;
using EAA.Infrastructure.Logic.EmployeeDetails;
using EAA.Infrastructure.Logic.FinancialYear;
using EAA.Infrastructure.Logic.SelfAppraisal;
using EAA.Services.Services.Appraisal;
using EAA.Services.Services.Cycle;
using EAA.Services.Services.EmployeeDetails;
using EAA.Services.Services.FinancialYear;
using EAA.Services.Services.SelfAppraisal;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

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

// Swagger + JWT
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});
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
builder.Services.AddTransient<IFinancial_infrastructure, Financial_infrastructure>();
builder.Services.AddTransient<ISelfAppraisal_infrastructure,SelfAppraisal_Infrastructure>();

builder.Services.AddTransient<IUser_Services, User_Services>();
builder.Services.AddTransient<ICycle_Services, Cycle_Services>();
builder.Services.AddTransient<IAppraisal_Services, Appraisal_Services>();
builder.Services.AddTransient<IFinancial_Services, Financial_Services>();
builder.Services.AddTransient<ISelfAppraisal_Services,SelfAppraisal_Services>();


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
