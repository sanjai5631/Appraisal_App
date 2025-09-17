using EAA.Domain.DTO.Request.Employee;
using EAA.Domain.DTO.Request.User;
using EAA.Domain.DTO.Response.Employee;
using EAA.Domain.DTO.Response.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Infrastructure.Logic.EmployeeDetails
{
    public interface IUser_infrastructure
    {
        List<EmployeeResponse_DTO> GetAllEmployees();
        EmployeeResponse_DTO GetEmployeeById(int employeeId);
        EmployeeResponse_DTO SaveEmployee(EmployeeRequest_DTO employeeRequest);
        UpdateEmployeeResponse_DTO UpdateEmployee(int employeeId, UpdateEmployeeRequest_DTO updateRequest);
        string DeleteEmployee(int employeeId); 
    
}
}
