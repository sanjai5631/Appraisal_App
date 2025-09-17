using EAA.Application;
using EAA.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace EAA.Infrastructure.Logic.Auth
{
    public class Auth_infrastructure : IAuth_infrastructure
    {
        private readonly DbAppraisalContext _context;
        private readonly ErrorHandler _error;

        public Auth_infrastructure(DbAppraisalContext context, ErrorHandler error)
        {
            _context = context;
            _error = error;
        }

        public TblEmployee? ValidateUser(string empCode, string password)
        {
            try
            {
                // Find employee by EmpCode
                var employee = _context.TblEmployees
                    .Include(e => e.Role)
                    .FirstOrDefault(e => e.EmpCode == empCode && e.IsDeleted == false && e.IsActive == true);

                if (employee == null)
                    return null;

                // Verify password (assuming you have a PasswordHasher utility)
                bool isValid = PasswordHasher.VerifyPassword(password, employee.Password);
                return isValid ? employee : null;
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Auth_infrastructure -> ValidateUser");
                return null;
            }
        }
    }
}
