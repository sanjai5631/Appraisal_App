using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace EAA.Domain.Models;

public partial class DbAppraisalContext : DbContext
{
    public DbAppraisalContext()
    {
    }

    public DbAppraisalContext(DbContextOptions<DbAppraisalContext> options)
        : base(options)
    {
    }

    public virtual DbSet<TblAppraisal> TblAppraisals { get; set; }

    public virtual DbSet<TblAppraisalCycle> TblAppraisalCycles { get; set; }

    public virtual DbSet<TblAppraisalResponse> TblAppraisalResponses { get; set; }

    public virtual DbSet<TblAppraisalResult> TblAppraisalResults { get; set; }

    public virtual DbSet<TblAppraisalTemplate> TblAppraisalTemplates { get; set; }

    public virtual DbSet<TblAssignedForm> TblAssignedForms { get; set; }

    public virtual DbSet<TblCycleStatus> TblCycleStatuses { get; set; }

    public virtual DbSet<TblDepartment> TblDepartments { get; set; }

    public virtual DbSet<TblEmployee> TblEmployees { get; set; }

    public virtual DbSet<TblFeedback> TblFeedbacks { get; set; }

    public virtual DbSet<TblGender> TblGenders { get; set; }

    public virtual DbSet<TblKpi> TblKpis { get; set; }

    public virtual DbSet<TblNotification> TblNotifications { get; set; }

    public virtual DbSet<TblQualification> TblQualifications { get; set; }

    public virtual DbSet<TblRole> TblRoles { get; set; }

    public virtual DbSet<TblTemplateKpi> TblTemplateKpis { get; set; }

    public virtual DbSet<TblUnit> TblUnits { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=db_appraisal;Username=postgres;Password=postgres");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TblAppraisal>(entity =>
        {
            entity.HasKey(e => e.AppraisalId).HasName("tbl_appraisals_pkey");

            entity.ToTable("tbl_appraisals");

            entity.Property(e => e.AppraisalId).HasColumnName("appraisal_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_on");
            entity.Property(e => e.CycleId).HasColumnName("cycle_id");
            entity.Property(e => e.EmployeeId).HasColumnName("employee_id");
            entity.Property(e => e.FinalRating)
                .HasMaxLength(20)
                .HasColumnName("final_rating");
            entity.Property(e => e.ModifiedBy).HasColumnName("modified_by");
            entity.Property(e => e.ModifiedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("modified_on");
            entity.Property(e => e.OverallSelfScore)
                .HasPrecision(5, 2)
                .HasColumnName("overall_self_score");
            entity.Property(e => e.OverallSupervisorScore)
                .HasPrecision(5, 2)
                .HasColumnName("overall_supervisor_score");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Open'::character varying")
                .HasColumnName("status");
            entity.Property(e => e.TemplateId).HasColumnName("template_id");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.TblAppraisalCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_appraisals_created_by_fkey");

            entity.HasOne(d => d.Cycle).WithMany(p => p.TblAppraisals)
                .HasForeignKey(d => d.CycleId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("tbl_appraisals_cycle_id_fkey");

            entity.HasOne(d => d.Employee).WithMany(p => p.TblAppraisalEmployees)
                .HasForeignKey(d => d.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("tbl_appraisals_employee_id_fkey");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.TblAppraisalModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_appraisals_modified_by_fkey");

            entity.HasOne(d => d.Template).WithMany(p => p.TblAppraisals)
                .HasForeignKey(d => d.TemplateId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_appraisals_template_id_fkey");
        });

        modelBuilder.Entity<TblAppraisalCycle>(entity =>
        {
            entity.HasKey(e => e.CycleId).HasName("tbl_appraisal_cycles_pkey");

            entity.ToTable("tbl_appraisal_cycles");

            entity.Property(e => e.CycleId).HasColumnName("cycle_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_on");
            entity.Property(e => e.CycleName)
                .HasMaxLength(100)
                .HasColumnName("cycle_name");
            entity.Property(e => e.EndDate).HasColumnName("end_date");
            entity.Property(e => e.ModifiedBy).HasColumnName("modified_by");
            entity.Property(e => e.ModifiedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("modified_on");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.StatusId)
                .HasDefaultValue(1)
                .HasColumnName("status_id");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.TblAppraisalCycleCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_appraisal_cycles_created_by_fkey");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.TblAppraisalCycleModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_appraisal_cycles_modified_by_fkey");

            entity.HasOne(d => d.Status).WithMany(p => p.TblAppraisalCycles)
                .HasForeignKey(d => d.StatusId)
                .HasConstraintName("tbl_appraisal_cycles_status_id_fkey");
        });

        modelBuilder.Entity<TblAppraisalResponse>(entity =>
        {
            entity.HasKey(e => e.ResponseId).HasName("tbl_appraisal_responses_pkey");

            entity.ToTable("tbl_appraisal_responses");

            entity.Property(e => e.ResponseId).HasColumnName("response_id");
            entity.Property(e => e.AppraisalId).HasColumnName("appraisal_id");
            entity.Property(e => e.AssociateComment).HasColumnName("associate_comment");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_on");
            entity.Property(e => e.KpiId).HasColumnName("kpi_id");
            entity.Property(e => e.ModifiedBy).HasColumnName("modified_by");
            entity.Property(e => e.ModifiedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("modified_on");
            entity.Property(e => e.SelfScore)
                .HasPrecision(3, 2)
                .HasColumnName("self_score");
            entity.Property(e => e.SupervisorComment).HasColumnName("supervisor_comment");
            entity.Property(e => e.SupervisorScore)
                .HasPrecision(3, 2)
                .HasColumnName("supervisor_score");

            entity.HasOne(d => d.Appraisal).WithMany(p => p.TblAppraisalResponses)
                .HasForeignKey(d => d.AppraisalId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("tbl_appraisal_responses_appraisal_id_fkey");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.TblAppraisalResponseCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_appraisal_responses_created_by_fkey");

            entity.HasOne(d => d.Kpi).WithMany(p => p.TblAppraisalResponses)
                .HasForeignKey(d => d.KpiId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("tbl_appraisal_responses_kpi_id_fkey");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.TblAppraisalResponseModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_appraisal_responses_modified_by_fkey");
        });

        modelBuilder.Entity<TblAppraisalResult>(entity =>
        {
            entity.HasKey(e => e.ResultId).HasName("tbl_appraisal_results_pkey");

            entity.ToTable("tbl_appraisal_results");

            entity.Property(e => e.ResultId).HasColumnName("result_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_on");
            entity.Property(e => e.CycleId).HasColumnName("cycle_id");
            entity.Property(e => e.EmployeeId).HasColumnName("employee_id");
            entity.Property(e => e.FinalRating)
                .HasMaxLength(20)
                .HasColumnName("final_rating");
            entity.Property(e => e.FinalizedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("finalized_at");
            entity.Property(e => e.FinalizedBy).HasColumnName("finalized_by");
            entity.Property(e => e.ModifiedBy).HasColumnName("modified_by");
            entity.Property(e => e.ModifiedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("modified_on");
            entity.Property(e => e.OverallScore)
                .HasPrecision(5, 2)
                .HasColumnName("overall_score");
            entity.Property(e => e.PromotionEligible)
                .HasDefaultValue(false)
                .HasColumnName("promotion_eligible");
            entity.Property(e => e.Remarks).HasColumnName("remarks");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.TblAppraisalResultCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_appraisal_results_created_by_fkey");

            entity.HasOne(d => d.Cycle).WithMany(p => p.TblAppraisalResults)
                .HasForeignKey(d => d.CycleId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("tbl_appraisal_results_cycle_id_fkey");

            entity.HasOne(d => d.Employee).WithMany(p => p.TblAppraisalResultEmployees)
                .HasForeignKey(d => d.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("tbl_appraisal_results_employee_id_fkey");

            entity.HasOne(d => d.FinalizedByNavigation).WithMany(p => p.TblAppraisalResultFinalizedByNavigations)
                .HasForeignKey(d => d.FinalizedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_appraisal_results_finalized_by_fkey");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.TblAppraisalResultModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_appraisal_results_modified_by_fkey");
        });

        modelBuilder.Entity<TblAppraisalTemplate>(entity =>
        {
            entity.HasKey(e => e.TemplateId).HasName("tbl_appraisal_templates_pkey");

            entity.ToTable("tbl_appraisal_templates");

            entity.Property(e => e.TemplateId).HasColumnName("template_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_on");
            entity.Property(e => e.DepartmentId).HasColumnName("department_id");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.ModifiedBy).HasColumnName("modified_by");
            entity.Property(e => e.ModifiedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("modified_on");
            entity.Property(e => e.TemplateName)
                .HasMaxLength(150)
                .HasColumnName("template_name");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.TblAppraisalTemplateCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_appraisal_templates_created_by_fkey");

            entity.HasOne(d => d.Department).WithMany(p => p.TblAppraisalTemplates)
                .HasForeignKey(d => d.DepartmentId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_appraisal_templates_department_id_fkey");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.TblAppraisalTemplateModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_appraisal_templates_modified_by_fkey");
        });

        modelBuilder.Entity<TblAssignedForm>(entity =>
        {
            entity.HasKey(e => e.AssignmentId).HasName("tbl_assigned_forms_pkey");

            entity.ToTable("tbl_assigned_forms");

            entity.Property(e => e.AssignmentId).HasColumnName("assignment_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_on");
            entity.Property(e => e.CycleId).HasColumnName("cycle_id");
            entity.Property(e => e.EmployeeId).HasColumnName("employee_id");
            entity.Property(e => e.ModifiedBy).HasColumnName("modified_by");
            entity.Property(e => e.ModifiedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("modified_on");
            entity.Property(e => e.StatusId)
                .HasDefaultValue(1)
                .HasColumnName("status_id");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.TblAssignedFormCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_assigned_forms_created_by_fkey");

            entity.HasOne(d => d.Cycle).WithMany(p => p.TblAssignedForms)
                .HasForeignKey(d => d.CycleId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("tbl_assigned_forms_cycle_id_fkey");

            entity.HasOne(d => d.Employee).WithMany(p => p.TblAssignedFormEmployees)
                .HasForeignKey(d => d.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("tbl_assigned_forms_employee_id_fkey");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.TblAssignedFormModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_assigned_forms_modified_by_fkey");

            entity.HasOne(d => d.Status).WithMany(p => p.TblAssignedForms)
                .HasForeignKey(d => d.StatusId)
                .HasConstraintName("tbl_assigned_forms_status_id_fkey");
        });

        modelBuilder.Entity<TblCycleStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("tbl_cycle_status_pkey");

            entity.ToTable("tbl_cycle_status");

            entity.HasIndex(e => e.StatusName, "tbl_cycle_status_status_name_key").IsUnique();

            entity.Property(e => e.StatusId).HasColumnName("status_id");
            entity.Property(e => e.StatusName)
                .HasMaxLength(50)
                .HasColumnName("status_name");
        });

        modelBuilder.Entity<TblDepartment>(entity =>
        {
            entity.HasKey(e => e.DeptId).HasName("tbl_departments_pkey");

            entity.ToTable("tbl_departments");

            entity.HasIndex(e => e.DeptName, "tbl_departments_dept_name_key").IsUnique();

            entity.Property(e => e.DeptId).HasColumnName("dept_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_on");
            entity.Property(e => e.DeptName)
                .HasMaxLength(100)
                .HasColumnName("dept_name");
            entity.Property(e => e.ModifiedBy).HasColumnName("modified_by");
            entity.Property(e => e.ModifiedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("modified_on");
        });

        modelBuilder.Entity<TblEmployee>(entity =>
        {
            entity.HasKey(e => e.EmployeeId).HasName("tbl_employees_pkey");

            entity.ToTable("tbl_employees");

            entity.HasIndex(e => e.Email, "tbl_employees_email_key").IsUnique();

            entity.HasIndex(e => e.EmpCode, "tbl_employees_emp_code_key").IsUnique();

            entity.HasIndex(e => e.Phone, "tbl_employees_phone_key").IsUnique();

            entity.Property(e => e.EmployeeId).HasColumnName("employee_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_on");
            entity.Property(e => e.Dob).HasColumnName("dob");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.EmpCode)
                .HasMaxLength(20)
                .HasColumnName("emp_code");
            entity.Property(e => e.ExitDate)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("exit_date");
            entity.Property(e => e.GenderId).HasColumnName("gender_id");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.IsDeleted)
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");
            entity.Property(e => e.JoiningDate)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("joining_date");
            entity.Property(e => e.ModifiedBy).HasColumnName("modified_by");
            entity.Property(e => e.ModifiedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("modified_on");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .HasColumnName("password");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .HasColumnName("phone");
            entity.Property(e => e.QualificationId).HasColumnName("qualification_id");
            entity.Property(e => e.Religion)
                .HasMaxLength(50)
                .HasColumnName("religion");
            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.UnitId).HasColumnName("unit_id");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.InverseCreatedByNavigation)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_employees_created_by_fkey");

            entity.HasOne(d => d.Gender).WithMany(p => p.TblEmployees)
                .HasForeignKey(d => d.GenderId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_employees_gender_id_fkey");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.InverseModifiedByNavigation)
                .HasForeignKey(d => d.ModifiedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_employees_modified_by_fkey");

            entity.HasOne(d => d.Qualification).WithMany(p => p.TblEmployees)
                .HasForeignKey(d => d.QualificationId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_employees_qualification_id_fkey");

            entity.HasOne(d => d.Role).WithMany(p => p.TblEmployees)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_employees_role_id_fkey");

            entity.HasOne(d => d.Unit).WithMany(p => p.TblEmployees)
                .HasForeignKey(d => d.UnitId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_employees_unit_id_fkey");
        });

        modelBuilder.Entity<TblFeedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("tbl_feedback_pkey");

            entity.ToTable("tbl_feedback");

            entity.Property(e => e.FeedbackId).HasColumnName("feedback_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_on");
            entity.Property(e => e.CycleId).HasColumnName("cycle_id");
            entity.Property(e => e.EmployeeId).HasColumnName("employee_id");
            entity.Property(e => e.FeedbackText).HasColumnName("feedback_text");
            entity.Property(e => e.ModifiedBy).HasColumnName("modified_by");
            entity.Property(e => e.ModifiedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("modified_on");
            entity.Property(e => e.Rating)
                .HasPrecision(3, 2)
                .HasColumnName("rating");
            entity.Property(e => e.ReviewerId).HasColumnName("reviewer_id");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.TblFeedbackCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_feedback_created_by_fkey");

            entity.HasOne(d => d.Cycle).WithMany(p => p.TblFeedbacks)
                .HasForeignKey(d => d.CycleId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("tbl_feedback_cycle_id_fkey");

            entity.HasOne(d => d.Employee).WithMany(p => p.TblFeedbackEmployees)
                .HasForeignKey(d => d.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("tbl_feedback_employee_id_fkey");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.TblFeedbackModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_feedback_modified_by_fkey");

            entity.HasOne(d => d.Reviewer).WithMany(p => p.TblFeedbackReviewers)
                .HasForeignKey(d => d.ReviewerId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_feedback_reviewer_id_fkey");
        });

        modelBuilder.Entity<TblGender>(entity =>
        {
            entity.HasKey(e => e.GenderId).HasName("tbl_genders_pkey");

            entity.ToTable("tbl_genders");

            entity.HasIndex(e => e.GenderName, "tbl_genders_gender_name_key").IsUnique();

            entity.Property(e => e.GenderId).HasColumnName("gender_id");
            entity.Property(e => e.GenderName)
                .HasMaxLength(20)
                .HasColumnName("gender_name");
        });

        modelBuilder.Entity<TblKpi>(entity =>
        {
            entity.HasKey(e => e.KpiId).HasName("tbl_kpis_pkey");

            entity.ToTable("tbl_kpis");

            entity.Property(e => e.KpiId).HasColumnName("kpi_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_on");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.ModifiedBy).HasColumnName("modified_by");
            entity.Property(e => e.ModifiedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("modified_on");
            entity.Property(e => e.Title)
                .HasMaxLength(150)
                .HasColumnName("title");
            entity.Property(e => e.Weightage)
                .HasPrecision(5, 2)
                .HasColumnName("weightage");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.TblKpiCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_kpis_created_by_fkey");

            entity.HasOne(d => d.ModifiedByNavigation).WithMany(p => p.TblKpiModifiedByNavigations)
                .HasForeignKey(d => d.ModifiedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_kpis_modified_by_fkey");
        });

        modelBuilder.Entity<TblNotification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("tbl_notifications_pkey");

            entity.ToTable("tbl_notifications");

            entity.Property(e => e.NotificationId).HasColumnName("notification_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_on");
            entity.Property(e => e.EmployeeId).HasColumnName("employee_id");
            entity.Property(e => e.IsRead)
                .HasDefaultValue(false)
                .HasColumnName("is_read");
            entity.Property(e => e.Message).HasColumnName("message");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.TblNotificationCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("tbl_notifications_created_by_fkey");

            entity.HasOne(d => d.Employee).WithMany(p => p.TblNotificationEmployees)
                .HasForeignKey(d => d.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("tbl_notifications_employee_id_fkey");
        });

        modelBuilder.Entity<TblQualification>(entity =>
        {
            entity.HasKey(e => e.QualificationId).HasName("tbl_qualifications_pkey");

            entity.ToTable("tbl_qualifications");

            entity.HasIndex(e => e.QualificationName, "tbl_qualifications_qualification_name_key").IsUnique();

            entity.Property(e => e.QualificationId).HasColumnName("qualification_id");
            entity.Property(e => e.QualificationName)
                .HasMaxLength(100)
                .HasColumnName("qualification_name");
        });

        modelBuilder.Entity<TblRole>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("tbl_roles_pkey");

            entity.ToTable("tbl_roles");

            entity.HasIndex(e => e.RoleName, "tbl_roles_role_name_key").IsUnique();

            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.RoleName)
                .HasMaxLength(50)
                .HasColumnName("role_name");
        });

        modelBuilder.Entity<TblTemplateKpi>(entity =>
        {
            entity.HasKey(e => e.TemplateKpiId).HasName("tbl_template_kpis_pkey");

            entity.ToTable("tbl_template_kpis");

            entity.Property(e => e.TemplateKpiId).HasColumnName("template_kpi_id");
            entity.Property(e => e.KpiId).HasColumnName("kpi_id");
            entity.Property(e => e.TemplateId).HasColumnName("template_id");
            entity.Property(e => e.Weightage)
                .HasPrecision(5, 2)
                .HasColumnName("weightage");

            entity.HasOne(d => d.Kpi).WithMany(p => p.TblTemplateKpis)
                .HasForeignKey(d => d.KpiId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("tbl_template_kpis_kpi_id_fkey");

            entity.HasOne(d => d.Template).WithMany(p => p.TblTemplateKpis)
                .HasForeignKey(d => d.TemplateId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("tbl_template_kpis_template_id_fkey");
        });

        modelBuilder.Entity<TblUnit>(entity =>
        {
            entity.HasKey(e => e.UnitId).HasName("tbl_units_pkey");

            entity.ToTable("tbl_units");

            entity.HasIndex(e => e.UnitName, "tbl_units_unit_name_key").IsUnique();

            entity.Property(e => e.UnitId).HasColumnName("unit_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_on");
            entity.Property(e => e.ModifiedBy).HasColumnName("modified_by");
            entity.Property(e => e.ModifiedOn)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("modified_on");
            entity.Property(e => e.UnitName)
                .HasMaxLength(50)
                .HasColumnName("unit_name");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
