using EAA.Application;
using EAA.Domain.DTO.Request.Employee;
using EAA.Domain.DTO.Request.User;
using EAA.Domain.DTO.Response.Employee;
using EAA.Domain.DTO.Response.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Services.Services.EmployeeDetails
{
    public interface IUser_Services
    {
        ApiResponse<List<EmployeeResponse_DTO>> GetAllEmployees();
        ApiResponse<EmployeeResponse_DTO> GetEmployeeById(int employeeId);
        ApiResponse<EmployeeResponse_DTO> SaveEmployee(EmployeeRequest_DTO employeeRequest);
        ApiResponse<UpdateEmployeeResponse_DTO> UpdateEmployee(int employeeId, UpdateEmployeeRequest_DTO updateRequest);
        ApiResponse<string> DeleteEmployee(int employeeId);
    }
}
