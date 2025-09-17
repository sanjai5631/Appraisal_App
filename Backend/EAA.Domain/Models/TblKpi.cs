using System;
using System.Collections.Generic;

namespace EAA.Domain.Models;

public partial class TblKpi
{
    public int KpiId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public decimal? Weightage { get; set; }

    public DateTime? CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public virtual TblEmployee? CreatedByNavigation { get; set; }

    public virtual TblEmployee? ModifiedByNavigation { get; set; }

    public virtual ICollection<TblAppraisalResponse> TblAppraisalResponses { get; set; } = new List<TblAppraisalResponse>();

    public virtual ICollection<TblTemplateKpi> TblTemplateKpis { get; set; } = new List<TblTemplateKpi>();
}
