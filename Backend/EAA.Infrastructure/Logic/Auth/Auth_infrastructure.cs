using EAA.Application;
using EAA.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Net;
using System.Net.Mail;

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

        public bool SendEmployeeNotification(string toEmail, string empCode, string password)
        {
            try
            {
                var fromAddress = new MailAddress("hr@yourcompany.com", "HR Team");
                var toAddress = new MailAddress(toEmail);
                const string fromPassword = "YourEmailPassword"; // Use secure way in production
                string subject = "Your Employee Account Details";
                string body = $"Welcome! \n\nYour employee account has been created.\n\n" +
                              $"Employee Code: {empCode}\nPassword: {password}\n\n" +
                              "Please login to the portal.";

                var smtp = new SmtpClient
                {
                    Host = "smtp.yourmailserver.com",
                    Port = 587,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
                };

                using (var message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = subject,
                    Body = body
                })
                {
                    smtp.Send(message);
                }

                return true;
            }
            catch (Exception)
            {
                return false;
            }
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
