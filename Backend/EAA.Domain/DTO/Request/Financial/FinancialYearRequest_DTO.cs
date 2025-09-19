using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Domain.DTO.Request.Financial
{
    public class FinancialYearRequest_DTO
    {
        [Required(ErrorMessage = "Year name is required.")]
        [StringLength(50, ErrorMessage = "Year name cannot exceed 50 characters.")]
        public string YearName { get; set; } = null!;

        [Required(ErrorMessage = "Start year is required.")]
        [Range(1900, 9999, ErrorMessage = "Start year must be between 1900 and 9999.")]
        public int StartYear { get; set; }

        [Required(ErrorMessage = "End year is required.")]
        [Range(1900, 9999, ErrorMessage = "End year must be between 1900 and 9999.")]
        public int EndYear { get; set; }
    }
}
