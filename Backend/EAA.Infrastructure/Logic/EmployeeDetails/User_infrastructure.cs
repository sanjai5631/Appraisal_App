using EAA.Application;
using EAA.Domain.DTO.Request.Employee;
using EAA.Domain.DTO.Request.User;
using EAA.Domain.DTO.Response.Employee;
using EAA.Domain.DTO.Response.User;
using EAA.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EAA.Infrastructure.Logic.EmployeeDetails
{
    public class User_infrastructure : IUser_infrastructure
    {
        private readonly DbAppraisalContext _context;
        private readonly ErrorHandler _error;

        public User_infrastructure(DbAppraisalContext context, ErrorHandler error)
        {
            _context = context;
            _error = error;
        }

       
        // GET all employees
        public List<EmployeeResponse_DTO> GetAllEmployees()
        {
            try
            {
                var employees = _context.TblEmployees
                    .Where(e => e.IsDeleted == false)
                    .Include(e => e.Gender)
                    .Include(e => e.Role)
                    .Include(e => e.Qualification)
                    .Include(e => e.Unit)
                    .Include(e => e.CreatedByNavigation)
                    .Include(e => e.ModifiedByNavigation).ToList()
                    .Select(e => new EmployeeResponse_DTO
                    {
                        EmployeeId = e.EmployeeId,
                        EmpCode = e.EmpCode,
                        Name = e.Name,
                        Gender = e.Gender?.GenderName,
                        Religion = e.Religion,
                        Phone = e.Phone,
                        Email = e.Email,
                        Role = e.Role?.RoleName,
                        Qualification = e.Qualification?.QualificationName,
                        Dob = e.Dob,
                        JoiningDate = e.JoiningDate,
                        Unit = e.Unit?.UnitName,
                        IsActive = e.IsActive ?? true,
                        IsDeleted = e.IsDeleted ?? false,
                        CreatedOn = e.CreatedOn,
                        ModifiedOn = e.ModifiedOn,
                        CreatedBy = e.CreatedByNavigation?.Name,
                        ModifiedBy = e.ModifiedByNavigation?.Name
                    })
                    .ToList();

                return employees;
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in User_infrastructure -> GetAllEmployees");
                return new List<EmployeeResponse_DTO>();
            }
        }

        // GET employee by ID
        public EmployeeResponse_DTO GetEmployeeById(int employeeId)
        {
            try
            {
                var e = _context.TblEmployees
                    .Where(emp => emp.EmployeeId == employeeId && emp.IsDeleted == false)
                    .Include(emp => emp.Gender)
                    .Include(emp => emp.Role)
                    .Include(emp => emp.Qualification)
                    .Include(emp => emp.Unit)
                    .Include(emp => emp.CreatedByNavigation)
                    .Include(emp => emp.ModifiedByNavigation)
                    .FirstOrDefault();

                if (e == null)
                {
                    _error.Capture(new Exception("Not found"), $"User_infrastructure -> GetEmployeeById({employeeId})");
                    return null;
                }

                return new EmployeeResponse_DTO
                {
                    EmployeeId = e.EmployeeId,
                    EmpCode = e.EmpCode,
                    Name = e.Name,
                    Gender = e.Gender?.GenderName,
                    Religion = e.Religion,
                    Phone = e.Phone,
                    Email = e.Email,
                    Role = e.Role?.RoleName,
                    Qualification = e.Qualification?.QualificationName,
                    Dob = e.Dob,
                    JoiningDate = e.JoiningDate,
                    Unit = e.Unit?.UnitName,
                    IsActive = e.IsActive ?? true,
                    IsDeleted = e.IsDeleted ?? false,
                    CreatedOn = e.CreatedOn,
                    ModifiedOn = e.ModifiedOn,
                    CreatedBy = e.CreatedByNavigation?.Name,
                    ModifiedBy = e.ModifiedByNavigation?.Name
                };
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in User_infrastructure -> GetEmployeeById");
                return null;
            }
        }



        // Sava employee
        public EmployeeResponse_DTO SaveEmployee(EmployeeRequest_DTO employeeRequest)
        {
            try
            {
              
                var creator = _context.TblEmployees
                    .Include(e => e.Role)
                    .FirstOrDefault(e => e.EmployeeId == employeeRequest.CreatedBy);

                if (creator == null || creator.Role?.RoleName != "Admin")
                {
                    _error.Capture(new Exception("Unauthorized"), "Only Admin can add new employees");
                    return null;
                }

                var employee = new TblEmployee
                {
                    EmpCode = employeeRequest.EmpCode,
                    Name = employeeRequest.Name,
                    GenderId = employeeRequest.GenderId,
                    Religion = employeeRequest.Religion,
                    Phone = employeeRequest.Phone,
                    Email = employeeRequest.Email,
                    Password = employeeRequest.Password,
                    RoleId = employeeRequest.RoleId,
                    QualificationId = employeeRequest.QualificationId,
                    Dob = employeeRequest.Dob,
                    JoiningDate = employeeRequest.JoiningDate.HasValue
                        ? DateTime.SpecifyKind(employeeRequest.JoiningDate.Value, DateTimeKind.Unspecified)
                        : (DateTime?)null,
                    UnitId = employeeRequest.UnitId,
                    IsActive = employeeRequest.IsActive ?? true,
                    IsDeleted = false,
                    CreatedOn = DateTime.Now,
                    CreatedBy = employeeRequest.CreatedBy
                };

                _context.TblEmployees.Add(employee);
                _context.SaveChanges();

               
                var saved = _context.TblEmployees
                    .Include(e => e.Gender)
                    .Include(e => e.Role)
                    .Include(e => e.Qualification)
                    .Include(e => e.Unit)
                    .Include(e => e.CreatedByNavigation)
                    .FirstOrDefault(e => e.EmployeeId == employee.EmployeeId);

                return new EmployeeResponse_DTO
                {
                    EmployeeId = saved.EmployeeId,
                    EmpCode = saved.EmpCode,
                    Name = saved.Name,
                    Gender = saved.Gender?.GenderName,
                    Religion = saved.Religion,
                    Phone = saved.Phone,
                    Email = saved.Email,
                    Role = saved.Role?.RoleName,
                    Qualification = saved.Qualification?.QualificationName,
                    Dob = saved.Dob,
                    JoiningDate = saved.JoiningDate,
                    Unit = saved.Unit?.UnitName,
                    IsActive = saved.IsActive ?? true,
                    IsDeleted = saved.IsDeleted ?? false,
                    CreatedOn = saved.CreatedOn,
                    CreatedBy = saved.CreatedByNavigation?.Name
                };
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in User_infrastructure -> SaveEmployee");
                return null;
            }
        }


        public UpdateEmployeeResponse_DTO UpdateEmployee(int employeeId, UpdateEmployeeRequest_DTO updateRequest)
        {
            try
            {
                var employee = _context.TblEmployees
                    .Include(e => e.Gender)
                    .Include(e => e.Role)
                    .Include(e => e.Qualification)
                    .Include(e => e.Unit)
                    .Include(e => e.CreatedByNavigation)
                    .Include(e => e.ModifiedByNavigation)
                    .FirstOrDefault(e => e.EmployeeId == employeeId && e.IsDeleted == false);

                if (employee == null)
                {
                    _error.Capture(new Exception("Not found"), $"User_infrastructure -> UpdateEmployee({employeeId})");
                    return null;
                }

               
                var modifier = _context.TblEmployees
                    .Include(m => m.Role)
                    .FirstOrDefault(m => m.EmployeeId == updateRequest.ModifiedBy);

                if (modifier == null || modifier.Role?.RoleName != "HR")
                {
                    _error.Capture(new Exception("Unauthorized"), "Only HR can modify employee records");
                    return null; 
                }

                
                employee.Name = updateRequest.Name ?? employee.Name;
                employee.GenderId = updateRequest.Gender != null
                    ? _context.TblGenders.FirstOrDefault(g => g.GenderName == updateRequest.Gender)?.GenderId
                    : employee.GenderId;
                employee.Religion = updateRequest.Religion ?? employee.Religion;
                employee.Phone = updateRequest.Phone ?? employee.Phone;
                employee.Email = updateRequest.Email ?? employee.Email;
                employee.RoleId = updateRequest.Role != null
                    ? _context.TblRoles.FirstOrDefault(r => r.RoleName == updateRequest.Role)?.RoleId
                    : employee.RoleId;
                employee.QualificationId = updateRequest.Qualification != null
                    ? _context.TblQualifications.FirstOrDefault(q => q.QualificationName == updateRequest.Qualification)?.QualificationId
                    : employee.QualificationId;
                employee.Dob = updateRequest.Dob ?? employee.Dob;
                employee.JoiningDate = updateRequest.JoiningDate ?? employee.JoiningDate;
                employee.UnitId = updateRequest.Unit != null
                    ? _context.TblUnits.FirstOrDefault(u => u.UnitName == updateRequest.Unit)?.UnitId
                    : employee.UnitId;
                employee.IsActive = updateRequest.IsActive ?? employee.IsActive;
                employee.ModifiedOn = DateTime.Now;
                employee.ModifiedBy = updateRequest.ModifiedBy;

                _context.SaveChanges();

               
                return new UpdateEmployeeResponse_DTO
                {
                    EmployeeId = employee.EmployeeId,
                    EmpCode = employee.EmpCode,
                    Name = employee.Name,
                    Gender = employee.Gender?.GenderName,
                    Religion = employee.Religion,
                    Phone = employee.Phone,
                    Email = employee.Email,
                    Role = employee.Role?.RoleName,
                    Qualification = employee.Qualification?.QualificationName,
                    Dob = employee.Dob,
                    JoiningDate = employee.JoiningDate,
                    Unit = employee.Unit?.UnitName,
                    IsActive = employee.IsActive ?? true,
                    IsDeleted = employee.IsDeleted ?? false,
                    CreatedOn = employee.CreatedOn,
                    ModifiedOn = employee.ModifiedOn,
                    CreatedBy = employee.CreatedByNavigation?.Name,
                    ModifiedBy = employee.ModifiedByNavigation?.Name
                };
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in User_infrastructure -> UpdateEmployee");
                return null;
            }
        }


        //DELETE employee
        public string DeleteEmployee(int employeeId)
        {
            try
            {
                var employee = _context.TblEmployees.FirstOrDefault(e => e.EmployeeId == employeeId && e.IsDeleted == false);
                if (employee == null) return "Employee not found";

                employee.IsDeleted = true;
                employee.ModifiedOn = DateTime.Now;

                _context.SaveChanges();
                return "Employee deleted successfully";
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in User_infrastructure -> DeleteEmployee");
                return $"Error deleting employee: {ex.Message}";
            }
        }
    }
}
