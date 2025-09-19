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
                    .Include(e => e.ModifiedByNavigation)
                    .Select(e => new EmployeeResponse_DTO
                    {
                        EmployeeId = e.EmployeeId,
                        EmpCode = e.EmpCode,
                        Name = e.Name,
                        Gender = e.Gender != null ? e.Gender.GenderName : null,
                        Religion = e.Religion,
                        Phone = e.Phone,
                        Email = e.Email,
                        Role = e.Role != null ? e.Role.RoleName : null,
                        Qualification = e.Qualification != null ? e.Qualification.QualificationName : null,
                        Dob = e.Dob,
                        JoiningDate = e.JoiningDate,
                        Unit = e.Unit != null ? e.Unit.UnitName : null,
                        IsActive = e.IsActive ?? true,
                        IsDeleted = e.IsDeleted ?? false,
                        CreatedOn = e.CreatedOn,
                        ModifiedOn = e.ModifiedOn,
                        CreatedBy = e.CreatedByNavigation != null ? e.CreatedByNavigation.Name : null,
                        ModifiedBy = e.ModifiedByNavigation != null ? e.ModifiedByNavigation.Name : null
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
                // 1️⃣ Get the creator (HR & Finance employee) from DB
                var creator = _context.TblEmployees
                    .Include(e => e.Role)
                    .FirstOrDefault(e => e.EmployeeId == employeeRequest.CreatedBy);

                // 2️⃣ Check if creator exists and has HR & Finance role
                if (creator == null || !string.Equals(creator.Role?.RoleName, "HR & Finance", StringComparison.OrdinalIgnoreCase))
                {
                    _error.Capture(new Exception("Unauthorized"), "Only HR & Finance can add new employees");
                    return null;
                }

                // 3️⃣ Create the new employee
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
                    DeptId = employeeRequest.DeptId,
                    IsActive = employeeRequest.IsActive ?? true,
                    IsDeleted = false,
                    CreatedOn = DateTime.Now,
                    CreatedBy = employeeRequest.CreatedBy
                };

                _context.TblEmployees.Add(employee);
                _context.SaveChanges();

                // 4️⃣ Reload saved employee with related entities
                var saved = _context.TblEmployees
                    .Include(e => e.Gender)
                    .Include(e => e.Role)
                    .Include(e => e.Qualification)
                    .Include(e => e.Unit)
                    .Include(e => e.Dept)
                    .Include(e => e.CreatedByNavigation)
                    .FirstOrDefault(e => e.EmployeeId == employee.EmployeeId);

                if (saved == null)
                    return null; // Just in case

                // 5️⃣ Map to response DTO
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
                    Department = saved.Dept?.DeptName,
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

        //update
        public UpdateEmployeeResponse_DTO UpdateEmployee(int employeeId, UpdateEmployeeRequest_DTO updateRequest)
        {
            try
            {
                var employee = _context.TblEmployees
                    .Include(e => e.Gender)
                    .Include(e => e.Role)
                    .Include(e => e.Qualification)
                    .Include(e => e.Unit)
                    .Include(e => e.Dept)
                    .Include(e => e.CreatedByNavigation)
                    .Include(e => e.ModifiedByNavigation)
                    .FirstOrDefault(e => e.EmployeeId == employeeId && e.IsDeleted == false);

                if (employee == null)
                {
                    _error.Capture(new Exception("Not found"), $"User_infrastructure -> UpdateEmployee({employeeId})");
                    return null;
                }

                // Check if modifier is HR
                var modifier = _context.TblEmployees
                    .Include(m => m.Role)
                    .FirstOrDefault(m => m.EmployeeId == updateRequest.ModifiedBy);

                if (modifier == null || modifier.Role?.RoleName != "HR & Finance")
                {
                    _error.Capture(new Exception("Unauthorized"), "Only HR can modify employee records");
                    return null;
                }

                // Update scalar properties
                employee.Name = updateRequest.Name ?? employee.Name;
                employee.Religion = updateRequest.Religion ?? employee.Religion;
                employee.Phone = updateRequest.Phone ?? employee.Phone;
                employee.Email = updateRequest.Email ?? employee.Email;
                employee.Dob = updateRequest.Dob ?? employee.Dob;
                employee.JoiningDate = updateRequest.JoiningDate ?? employee.JoiningDate;
                employee.IsActive = updateRequest.IsActive ?? employee.IsActive;

                // Update FKs directly from DTO
                if (updateRequest.GenderId.HasValue)
                    employee.GenderId = updateRequest.GenderId;

                if (updateRequest.RoleId.HasValue)
                    employee.RoleId = updateRequest.RoleId;

                if (updateRequest.QualificationId.HasValue)
                    employee.QualificationId = updateRequest.QualificationId;

                if (updateRequest.UnitId.HasValue)
                    employee.UnitId = updateRequest.UnitId;

                if(updateRequest.DeptId.HasValue)
                    employee.DeptId = updateRequest.DeptId;

                // Audit fields
                employee.ModifiedOn = DateTime.Now;
                employee.ModifiedBy = updateRequest.ModifiedBy;

                _context.SaveChanges();

                // Build response DTO
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
                    Department=employee.Dept?.DeptName,
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
