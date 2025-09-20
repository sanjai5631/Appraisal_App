using System;
using System.Collections.Generic;

namespace EAA.Models;

public partial class TblAppraisalResult
{
    public int ResultId { get; set; }

    public int? EmployeeId { get; set; }

    public int? CycleId { get; set; }

    public decimal? OverallScore { get; set; }

    public string? FinalRating { get; set; }

    public bool? PromotionEligible { get; set; }

    public string? Remarks { get; set; }

    public int? FinalizedBy { get; set; }

    public DateTime? FinalizedAt { get; set; }

    public DateTime? CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public virtual TblEmployee? CreatedByNavigation { get; set; }

    public virtual TblAppraisalCycle? Cycle { get; set; }

    public virtual TblEmployee? Employee { get; set; }

    public virtual TblEmployee? FinalizedByNavigation { get; set; }

    public virtual TblEmployee? ModifiedByNavigation { get; set; }
}
