using System;
using System.Collections.Generic;

namespace EAA.Models;

public partial class TblAppraisal
{
    public int AppraisalId { get; set; }

    public int? EmployeeId { get; set; }

    public int? CycleId { get; set; }

    public int? TemplateId { get; set; }

    public string? Status { get; set; }

    public decimal? OverallSelfScore { get; set; }

    public decimal? OverallSupervisorScore { get; set; }

    public string? FinalRating { get; set; }

    public DateTime? CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public virtual TblEmployee? CreatedByNavigation { get; set; }

    public virtual TblAppraisalCycle? Cycle { get; set; }

    public virtual TblEmployee? Employee { get; set; }

    public virtual TblEmployee? ModifiedByNavigation { get; set; }

    public virtual TblCycleStatus? StatusNavigation { get; set; }

    public virtual ICollection<TblAppraisalResponse> TblAppraisalResponses { get; set; } = new List<TblAppraisalResponse>();

    public virtual TblAppraisalTemplate? Template { get; set; }
}
