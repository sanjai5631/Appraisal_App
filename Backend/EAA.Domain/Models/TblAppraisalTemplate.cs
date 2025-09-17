using System;
using System.Collections.Generic;

namespace EAA.Domain.Models;

public partial class TblAppraisalTemplate
{
    public int TemplateId { get; set; }

    public string TemplateName { get; set; } = null!;

    public int? DepartmentId { get; set; }

    public string? Description { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public virtual TblEmployee? CreatedByNavigation { get; set; }

    public virtual TblDepartment? Department { get; set; }

    public virtual TblEmployee? ModifiedByNavigation { get; set; }

    public virtual ICollection<TblAppraisal> TblAppraisals { get; set; } = new List<TblAppraisal>();

    public virtual ICollection<TblTemplateKpi> TblTemplateKpis { get; set; } = new List<TblTemplateKpi>();
}
