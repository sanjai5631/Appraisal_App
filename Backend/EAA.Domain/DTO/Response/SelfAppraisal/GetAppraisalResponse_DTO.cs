using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Domain.DTO.Response.SelfAppraisal
{
    public class GetAppraisalResponse_DTO
    {
            public int AppraisalId { get; set; }
            public int EmployeeId { get; set; }
            public string EmpCode { get; set; }           // From TblEmployee
            public string EmployeeName { get; set; }     // From TblEmployee
            public int? CycleId { get; set; }
            public string CycleName { get; set; }        // From TblAppraisalCycle
            public string FinancialYear { get; set; }    // From TblAppraisalCycle
            public string Status { get; set; }           // From TblAppraisal
            public decimal? OverallSelfScore { get; set; }          // Employee score
            public string OverallAssociateComment { get; set; }    // Employee comments
            public decimal? OverallSupervisorScore { get; set; }   // Manager score
            public string OverallSupervisorComment { get; set; }   // Manager comments
            public string FinalRating { get; set; }                 // Manager rating
        }


    }

