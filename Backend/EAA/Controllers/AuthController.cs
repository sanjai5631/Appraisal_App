using EAA.Application;
using EAA.Domain.DTO.Request.Auth;
using EAA.Domain.DTO.Request.Employee;
using EAA.Domain.DTO.Response.Auth;
using EAA.Domain.Models;
using EAA.Infrastructure.Logic.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EAA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly IAuth_infrastructure _auth;
        private readonly IConfiguration _config;
        private readonly ErrorHandler _error;

        public AuthController(IAuth_infrastructure auth, IConfiguration config, ErrorHandler errorHandler)
        {
            _auth = auth;
            _config = config;
            _error = errorHandler;
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] EmployeeLoginRequest_DTO request)
        {
            try
            {
                // Validate employee
                TblEmployee? employee = _auth.ValidateUser(request.EmpCode, request.Password);

                if (employee == null)
                    return Unauthorized(new { message = "Invalid EmpCode or Password" });

                // JWT claims
                var claims = new[]
                {
                    new Claim("EmployeeId", employee.EmployeeId.ToString()),
                    new Claim("DeptId", employee.DeptId?.ToString() ?? "0"),
                    new Claim(ClaimTypes.Name, employee.Name),
                    new Claim("EmpCode", employee.EmpCode),
                    new Claim(ClaimTypes.Role, employee.Role?.RoleName ?? "Employee")
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _config["Jwt:Issuer"],
                    audience: _config["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(Convert.ToDouble(_config["Jwt:ExpiresMinutes"])),
                    signingCredentials: creds
                );

                // Map response DTO
                var response = new EmployeeLoginResponse_DTO
                {
                    Token = new JwtSecurityTokenHandler().WriteToken(token),
                    Name = employee.Name,
                    Email = employee.Email,
                    EmpCode = employee.EmpCode,
                    EmployeeId = employee.EmployeeId,
                    DeptId = employee.DeptId
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in AuthController -> Login");
                return BadRequest(new { Message = "Login failed. Please try again later." });
            }
        }
    }
}
