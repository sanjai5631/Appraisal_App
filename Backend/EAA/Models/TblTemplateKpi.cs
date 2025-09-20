using System;
using System.Collections.Generic;

namespace EAA.Models;

public partial class TblTemplateKpi
{
    public int TemplateKpiId { get; set; }

    public int? TemplateId { get; set; }

    public int? KpiId { get; set; }

    public decimal? Weightage { get; set; }

    public virtual TblKpi? Kpi { get; set; }

    public virtual TblAppraisalTemplate? Template { get; set; }
}
