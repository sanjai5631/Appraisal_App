using EAA.Application;
using EAA.Domain.DTO.Request.Employee;
using EAA.Domain.DTO.Request.User;
using EAA.Domain.DTO.Response.Employee;
using EAA.Domain.DTO.Response.User;
using EAA.Infrastructure.Logic.EmployeeDetails;

namespace EAA.Services.Services.EmployeeDetails
{
    public class User_Services : IUser_Services
    {
        private readonly IUser_infrastructure _user;
        private readonly ErrorHandler _error;

        public User_Services(IUser_infrastructure userInfrastructure, ErrorHandler errorHandler)
        {
            _user = userInfrastructure;
            _error = errorHandler;
        }

        public ApiResponse<List<EmployeeResponse_DTO>> GetAllEmployees()
        {
            var response = new ApiResponse<List<EmployeeResponse_DTO>>();
            try
            {
                var employees = _user.GetAllEmployees(); 

                if (employees == null || !employees.Any())
                {
                    response.StatusCode = 404;
                    response.Message = "No employees found";
                }
                else
                {
                    response.StatusCode = 200;
                    response.Message = "Employees retrieved successfully";
                    response.Data = employees;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in User_Services -> GetAllEmployees");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve employees";
            }
            return response;
        }

        public ApiResponse<EmployeeResponse_DTO> GetEmployeeById(int employeeId)
        {
            var response = new ApiResponse<EmployeeResponse_DTO>();
            try
            {
                var employee = _user.GetEmployeeById(employeeId); // already DTO

                if (employee == null)
                {
                    response.StatusCode = 404;
                    response.Message = "Employee not found";
                }
                else
                {
                    response.StatusCode = 200;
                    response.Message = "Employee retrieved successfully";
                    response.Data = employee;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in User_Services -> GetEmployeeById");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve employee";
            }
            return response;
        }

        public ApiResponse<EmployeeResponse_DTO> SaveEmployee(EmployeeRequest_DTO employeeRequest)
        {
            var response = new ApiResponse<EmployeeResponse_DTO>();
            try
            {
                var employee = _user.SaveEmployee(employeeRequest); // already DTO

                if (employee == null)
                {
                    response.StatusCode = 400;
                    response.Message = "Failed to save employee";
                }
                else
                {
                    response.StatusCode = 201;
                    response.Message = "Employee saved successfully";
                    response.Data = employee;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in User_Services -> SaveEmployee");
                response.StatusCode = 500;
                response.Message = "Failed to save employee";
            }
            return response;
        }

        public ApiResponse<UpdateEmployeeResponse_DTO> UpdateEmployee(int employeeId, UpdateEmployeeRequest_DTO updateRequest)
        {
            var response = new ApiResponse<UpdateEmployeeResponse_DTO>();
            try
            {
                var updatedEmployee = _user.UpdateEmployee(employeeId, updateRequest); 

                if (updatedEmployee == null)
                {
                    response.StatusCode = 404;
                    response.Message = "Employee not found or not updated";
                }
                else
                {
                    response.StatusCode = 200;
                    response.Message = "Employee updated successfully";
                    response.Data = updatedEmployee;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in User_Services -> UpdateEmployee");
                response.StatusCode = 500;
                response.Message = "Failed to update employee";
            }
            return response;
        }

        public ApiResponse<string> DeleteEmployee(int employeeId)
        {
            var response = new ApiResponse<string>();
            try
            {
                var result = _user.DeleteEmployee(employeeId); 

                if (string.IsNullOrEmpty(result))
                {
                    response.StatusCode = 404;
                    response.Message = "Employee not found";
                }
                else
                {
                    response.StatusCode = 200;
                    response.Message = "Employee deleted successfully";
                    response.Data = result;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in User_Services -> DeleteEmployee");
                response.StatusCode = 500;
                response.Message = "Failed to delete employee";
            }
            return response;
        }
    }
}
