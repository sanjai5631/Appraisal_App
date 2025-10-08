using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Domain.DTO.Request.Mail
{
        public class EmployeeDTO
        {
            public int EmployeeId { get; set; }            // Employee unique ID
            public string Name { get; set; } = null!;     // Employee full name
            public string? Email { get; set; }            // Employee email (nullable if not set)
        public int? UnitId { get; set; }
    }
    }

