using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Domain.DTO.Request.Cycle
{
    public class CycleRequest_DTO
    {
        [Required(ErrorMessage = "Cycle name is required.")]
        [StringLength(100, ErrorMessage = "Cycle name cannot exceed 100 characters.")]
        public string CycleName { get; set; } = null!;

        [Required(ErrorMessage = "Start date is required.")]
        [DataType(DataType.Date)]
        public DateTime StartDate { get; set; }  

        [Required(ErrorMessage = "End date is required.")]
        [DataType(DataType.Date)]
        public DateTime EndDate { get; set; }     

        public int? StatusId { get; set; }

        [Required(ErrorMessage = "CreatedBy is required.")]
        public int CreatedBy { get; set; }

        public int? ModifiedBy { get; set; }
    }
}
