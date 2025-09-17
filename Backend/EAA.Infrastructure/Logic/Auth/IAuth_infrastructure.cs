using EAA.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Infrastructure.Logic.Auth
{
    public interface IAuth_infrastructure
    {
        TblEmployee? ValidateUser(string Empcode, string Password);
    }
}
