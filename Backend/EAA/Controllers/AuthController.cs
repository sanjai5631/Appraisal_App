using EAA.Application;
using EAA.Domain.DTO.Request.Auth;
using EAA.Domain.DTO.Request.Employee;
using EAA.Domain.DTO.Request.Mail;
using EAA.Domain.DTO.Response.Auth;
using EAA.Domain.Models;
using EAA.Infrastructure.Logic.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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


        //[HttpPost("SendEmployeeNotification")]
        //public IActionResult SendEmployeeNotification([FromBody] EmployeeNotificationRequest_DTO request)
        //{
        //    try
        //    {
        //        var employee = _context.TblEmployees.FirstOrDefault(e => e.EmployeeId == request.EmployeeId && e.IsActive && !e.IsDeleted);
        //        if (employee == null)
        //            return NotFound(new { message = "Employee not found" });

        //        bool emailSent = EmailHelper.SendEmployeeNotification(employee.Email, employee.EmpCode, employee.Password);

        //        if (!emailSent)
        //            return BadRequest(new { message = "Failed to send email. Check SMTP settings." });

        //        return Ok(new { message = "Email sent successfully" });
        //    }
        //    catch (Exception ex)
        //    {
        //        _error.Capture(ex, "Error in SendEmployeeNotification");
        //        return BadRequest(new { message = "An error occurred while sending email." });
        //    }
        //}

    }
}
