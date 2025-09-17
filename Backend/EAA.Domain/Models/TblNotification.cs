using System;
using System.Collections.Generic;

namespace EAA.Domain.Models;

public partial class TblNotification
{
    public int NotificationId { get; set; }

    public int? EmployeeId { get; set; }

    public string Message { get; set; } = null!;

    public bool? IsRead { get; set; }

    public DateTime? CreatedOn { get; set; }

    public int? CreatedBy { get; set; }

    public virtual TblEmployee? CreatedByNavigation { get; set; }

    public virtual TblEmployee? Employee { get; set; }
}
