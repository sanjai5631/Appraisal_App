using System;
using System.Collections.Generic;

namespace EAA.Models;

public partial class TblFeedback
{
    public int FeedbackId { get; set; }

    public int? EmployeeId { get; set; }

    public int? ReviewerId { get; set; }

    public int? CycleId { get; set; }

    public string? FeedbackText { get; set; }

    public decimal? Rating { get; set; }

    public DateTime? CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public virtual TblEmployee? CreatedByNavigation { get; set; }

    public virtual TblAppraisalCycle? Cycle { get; set; }

    public virtual TblEmployee? Employee { get; set; }

    public virtual TblEmployee? ModifiedByNavigation { get; set; }

    public virtual TblEmployee? Reviewer { get; set; }
}
