using System;
using System.Collections.Generic;

namespace EAA.Domain.Models;

public partial class TblAppraisalResponse
{
    public int ResponseId { get; set; }

    public int? AppraisalId { get; set; }

    public int? KpiId { get; set; }

    public decimal? SelfScore { get; set; }

    public decimal? SupervisorScore { get; set; }

    public string? AssociateComment { get; set; }

    public string? SupervisorComment { get; set; }

    public DateTime? CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public virtual TblAppraisal? Appraisal { get; set; }

    public virtual TblEmployee? CreatedByNavigation { get; set; }

    public virtual TblKpi? Kpi { get; set; }

    public virtual TblEmployee? ModifiedByNavigation { get; set; }
}
