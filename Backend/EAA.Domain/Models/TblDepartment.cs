using System;
using System.Collections.Generic;

namespace EAA.Domain.Models;

public partial class TblDepartment
{
    public int DeptId { get; set; }

    public string DeptName { get; set; } = null!;

    public DateTime? CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public virtual ICollection<TblAppraisalTemplate> TblAppraisalTemplates { get; set; } = new List<TblAppraisalTemplate>();
}
