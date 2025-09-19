using EAA.Application;
using EAA.Domain.DTO.Request.Employee;
using EAA.Domain.DTO.Request.User;
using EAA.Domain.DTO.Response.User;
using EAA.Infrastructure.Logic.EmployeeDetails;
using EAA.Services.Services.EmployeeDetails;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel.DataAnnotations;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace EAA.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class EmployeeController : ControllerBase
    {
       
        private readonly IUser_Services _user;
        private readonly ErrorHandler _error;

        public EmployeeController(ErrorHandler errorHandler,IUser_Services user_Services)
        {
            _error = errorHandler;
            _user = user_Services;
        }

        // GET
        [HttpGet]
        [Route("GetAllEmployee")]
        public IActionResult GetAllEmployees()
        {
            try
            {
                return Ok(_user.GetAllEmployees());

            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error In EmployeeController -> GetAllEmployee");
                return BadRequest(new { Message = "Failed to fetch all employee details." });
            }
               
        }

        // GET
        [HttpGet]
        [Route("GetEmployee")]
        public IActionResult GetEmployeeById([Required]int EmployeeId)
        {
            try
            {
                return Ok(_user.GetEmployeeById(EmployeeId));

            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error In EmployeeController -> GetEmployee");
                return BadRequest(new { Message = "Failed to fetch employee details." });
            }
        }
        //Post
        [HttpPost]
        [Route("SaveEmployeeDetails")]
        public IActionResult SaveEmployee([FromBody, Required] EmployeeRequest_DTO employeeRequest)
        {
            try
            {
                employeeRequest.Password = PasswordHasher.HashPassword(employeeRequest.Password);
                return Ok(_user.SaveEmployee(employeeRequest));
            }
            catch (Exception ex)
            {

                _error.Capture(ex, "Error In EmployeeController -> SaveEmployeeDetails");
                return BadRequest(new { Message = "Failed to save employee details." });
            }
        }
        //Update
        [HttpPut]
        [Route("UpdateEmployeeDetails")]
        public IActionResult UpdateEmployee([FromQuery, Required] int employeeId, [FromBody, Required] UpdateEmployeeRequest_DTO updateRequest)
        {
            try
            {
                return Ok(_user.UpdateEmployee(employeeId, updateRequest));
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error In UsersController -> UpdateDetails");
                return BadRequest(new { Message = "Failed to update user details." });
            }
        }

        //Delete
        [HttpDelete]
        [Route("DeleteEmployee")]
      
        public IActionResult DeleteEmployee([Required]int EmployeeId)
        {
            try
            {
                return Ok(_user.DeleteEmployee(EmployeeId));
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error In EmployeeController -> DeleteEmployee");
                return BadRequest(new { Message = "Failed to delete employee." });
            }
        }

    }
}
