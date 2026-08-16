import datetime
from sqlalchemy.orm import Session
from app.db.database import engine, Base, SessionLocal
from app.db.models import (
    Organization, Department, User, Workflow, WorkflowNode, WorkflowEdge,
    Application, WorkflowTask, DecisionPassport, ExceptionRecord,
    WorkflowDNA, OptimizationProposal, AuditLog
)

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if already seeded
    if db.query(Organization).filter_by(code="IITS-SIH").first():
        db.close()
        return
        
    print("Seeding Process Forge demo database...")
    
    # 1. Organization
    org = Organization(name="Indian Institute of Technology & Science", code="IITS-SIH")
    db.add(org)
    db.commit()
    db.refresh(org)
    
    # 2. Departments
    depts = [
        Department(name="Finance & Accounts", code="FIN", org_id=org.id, capacity=60, current_workload_pct=82.0, avg_processing_time_hours=18.0),
        Department(name="Admissions", code="ADM", org_id=org.id, capacity=50, current_workload_pct=67.0, avg_processing_time_hours=12.0),
        Department(name="Student Services", code="SS", org_id=org.id, capacity=40, current_workload_pct=54.0, avg_processing_time_hours=10.0),
        Department(name="Examination Cell", code="EXAM", org_id=org.id, capacity=45, current_workload_pct=43.0, avg_processing_time_hours=8.0),
        Department(name="Academics", code="ACAD", org_id=org.id, capacity=55, current_workload_pct=60.0, avg_processing_time_hours=14.0),
    ]
    db.add_all(depts)
    db.commit()
    
    fin_dept = db.query(Department).filter_by(code="FIN").first()
    acad_dept = db.query(Department).filter_by(code="ACAD").first()
    
    # 3. Users
    users = [
        User(
            email="student@forge.edu",
            hashed_password="password123",
            full_name="Rahul Sharma",
            role="Student",
            student_id_no="STU-2026-881",
            cgpa=8.7,
            attendance_pct=89.0,
            annual_income=320000.0
        ),
        User(
            email="officer.a@forge.edu",
            hashed_password="password123",
            full_name="Officer A (Finance Senior)",
            role="Officer",
            department_id=fin_dept.id
        ),
        User(
            email="officer.b@forge.edu",
            hashed_password="password123",
            full_name="Officer B (Finance Associate)",
            role="Officer",
            department_id=fin_dept.id
        ),
        User(
            email="admin@forge.edu",
            hashed_password="password123",
            full_name="Vikram Seth (Workflow Admin)",
            role="Admin"
        ),
        User(
            email="dean@forge.edu",
            hashed_password="password123",
            full_name="Dr. Arisudan Rao (Dean Student Welfare)",
            role="DepartmentHead",
            department_id=acad_dept.id
        )
    ]
    db.add_all(users)
    db.commit()
    
    student_user = db.query(User).filter_by(email="student@forge.edu").first()
    admin_user = db.query(User).filter_by(email="admin@forge.edu").first()
    officer_b = db.query(User).filter_by(email="officer.b@forge.edu").first()
    
    # 4. Flagship Scholarship Workflow
    wf_scholarship = Workflow(
        name="Student Scholarship Application",
        description="Flagship AI workflow for verifying student documents, academic marks, financial background, institutional rules, and officer sanction.",
        domain="Educational Institution",
        version="3.2",
        status="published",
        sla_hours=48,
        created_by=admin_user.id
    )
    db.add(wf_scholarship)
    db.commit()
    db.refresh(wf_scholarship)
    
    nodes_scholarship = [
        WorkflowNode(id="node-start", workflow_id=wf_scholarship.id, type="start", label="Application Submission", department="Student Portal", role="Student / Applicant", agent="OrchestratorAgent", sla_hours=2, requires_human=False),
        WorkflowNode(id="node-doc-verify", workflow_id=wf_scholarship.id, type="document_verification", label="AI Document Verification", department="Registrar", role="Document Officer", agent="DocumentAgent", sla_hours=6, requires_human=False, rules_json=["Validate Income Certificate", "Marksheet Checksum", "Bank Passbook OCR"]),
        WorkflowNode(id="node-academic", workflow_id=wf_scholarship.id, type="ai_validation", label="Academic Eligibility Check", department="Academics", role="Academic Officer", agent="AcademicAgent", sla_hours=12, requires_human=False, rules_json=["CGPA >= 7.5", "Attendance >= 75%", "No active backlogs"]),
        WorkflowNode(id="node-finance", workflow_id=wf_scholarship.id, type="ai_validation", label="Financial Audit & Fee Check", department="Finance & Accounts", role="Finance Officer", agent="FinanceAgent", sla_hours=12, requires_human=False, rules_json=["Income <= Rs 800,000", "Zero fee arrears", "Scholarship pool balance"]),
        WorkflowNode(id="node-compliance", workflow_id=wf_scholarship.id, type="ai_validation", label="Institutional Rule Compliance", department="Administration", role="Compliance Officer", agent="ComplianceAgent", sla_hours=6, requires_human=False, rules_json=["Single scholarship rule", "Clean conduct record"]),
        WorkflowNode(id="node-approval", workflow_id=wf_scholarship.id, type="human_review", label="Dean Sanction & Approval", department="Dean Student Welfare", role="Officer / Staff", agent="RoutingAgent", sla_hours=8, requires_human=True, rules_json=["Verify Decision Passport", "Manual signature required"]),
        WorkflowNode(id="node-notify", workflow_id=wf_scholarship.id, type="notification", label="Multi-channel Alert", department="System", role="System", agent="NotificationAgent", sla_hours=1, requires_human=False),
        WorkflowNode(id="node-end", workflow_id=wf_scholarship.id, type="end", label="Scholarship Sanctioned", department="System", role="System", agent="OrchestratorAgent", sla_hours=1, requires_human=False)
    ]
    edges_scholarship = [
        WorkflowEdge(workflow_id=wf_scholarship.id, source="node-start", target="node-doc-verify"),
        WorkflowEdge(workflow_id=wf_scholarship.id, source="node-doc-verify", target="node-academic"),
        WorkflowEdge(workflow_id=wf_scholarship.id, source="node-academic", target="node-finance"),
        WorkflowEdge(workflow_id=wf_scholarship.id, source="node-finance", target="node-compliance"),
        WorkflowEdge(workflow_id=wf_scholarship.id, source="node-compliance", target="node-approval"),
        WorkflowEdge(workflow_id=wf_scholarship.id, source="node-approval", target="node-notify"),
        WorkflowEdge(workflow_id=wf_scholarship.id, source="node-notify", target="node-end")
    ]
    db.add_all(nodes_scholarship + edges_scholarship)
    
    # 5. Additional Workflows (Bonafide, Admission, Exam, Fee Concession)
    wf_names = [
        ("Bonafide / Certificate Request", "Automated student identity and bonafide certificate verification and issue."),
        ("Admission Application Workflow", "Document validation and merit list scoring for new student admissions."),
        ("Examination Application Workflow", "Hall ticket generation, attendance eligibility, and fee receipt verification."),
        ("Fee Concession Request Workflow", "Financial concession request evaluation and committee approval.")
    ]
    for wfname, wfdesc in wf_names:
        w = Workflow(name=wfname, description=wfdesc, domain="Educational Institution", version="1.0", status="published", created_by=admin_user.id)
        db.add(w)
    db.commit()
    
    # 6. Flagship Demo Application
    app1 = Application(
        id="SCH-20481",
        applicant_id=student_user.id,
        workflow_id=wf_scholarship.id,
        title="Merit-cum-Means National Scholarship 2026",
        status="pending_human_review",
        current_node_id="node-approval",
        risk_score=0.04,
        sla_due_at=datetime.datetime.utcnow() + datetime.timedelta(hours=14),
        submitted_at=datetime.datetime.utcnow() - datetime.timedelta(hours=10),
        details_json={
            "scholarship_name": "Merit-cum-Means Engineering Grant",
            "amount_per_year": 50000,
            "annual_income": 320000,
            "cgpa": 8.7,
            "attendance": 89
        }
    )
    db.add(app1)
    db.commit()
    
    # 7. Decision Passport for SCH-20481
    passport = DecisionPassport(
        application_id=app1.id,
        passport_data={
            "request_id": "SCH-20481",
            "applicant": "Rahul Sharma (STU-2026-881)",
            "workflow": "Student Scholarship Application v3.2",
            "agent_evaluations": [
                {
                    "agent": "DocumentAgent",
                    "status": "PASS",
                    "confidence": 0.98,
                    "evidence": ["Income Tax Return receipt verified", "Semester 5 Marksheet verified", "Bank Passbook IFSC matched"]
                },
                {
                    "agent": "AcademicAgent",
                    "status": "PASS",
                    "confidence": 0.96,
                    "evidence": ["CGPA: 8.7 >= 7.5 threshold", "Attendance: 89% >= 75% threshold", "Backlogs: 0"]
                },
                {
                    "agent": "FinanceAgent",
                    "status": "PASS",
                    "confidence": 0.95,
                    "evidence": ["Annual Family Income: Rs. 320,000 <= Rs. 800,000 limit", "Tuition Fee Arrears: Rs. 0"]
                },
                {
                    "agent": "ComplianceAgent",
                    "status": "PASS",
                    "confidence": 0.99,
                    "evidence": ["Single active scholarship rule checked across national database", "Disciplinary rating: Excellent"]
                }
            ],
            "overall_recommendation": "APPROVE",
            "overall_confidence": 0.96,
            "risk_level": "LOW",
            "risk_score": 0.04,
            "requires_human_approval": True,
            "human_approval_reason": "High-value monetary grant (Rs. 50,000/yr) mandates human officer signature."
        }
    )
    db.add(passport)
    
    # 8. Pending Task for Officer
    task = WorkflowTask(
        application_id=app1.id,
        node_id="node-approval",
        title="Scholarship Final Approval: Rahul Sharma",
        assigned_role="Officer",
        assigned_user_id=officer_b.id,
        department="Finance & Accounts",
        status="pending",
        priority="high",
        ai_recommendation="APPROVE (96% Confidence)",
        ai_confidence=0.96,
        sla_due_at=datetime.datetime.utcnow() + datetime.timedelta(hours=14)
    )
    db.add(task)
    
    # 9. Exception Record (for Demo Scene 6)
    exc = ExceptionRecord(
        application_id=app1.id,
        exception_type="missing_document",
        description="Initial income certificate scan was blurred. ExceptionAgent requested high-resolution re-upload.",
        status="resolved",
        resolution_note="Student uploaded verified digilocker document."
    )
    db.add(exc)
    
    # 10. Workflow DNA
    dna = WorkflowDNA(
        workflow_id=wf_scholarship.id,
        avg_processing_hours=3.8,
        sla_compliance_pct=91.0,
        failure_rate_pct=7.2,
        bottleneck_department="Finance & Accounts",
        automation_potential_pct=68.0,
        total_executions=1284,
        metrics_json={
            "rejection_rate": "4.1%",
            "peak_period": "June - August",
            "avg_tasks_per_request": 7,
            "department_breakdown": {
                "Registrar": "0.6 hrs",
                "Academics": "1.2 hrs",
                "Finance": "1.8 hrs",
                "Administration": "0.2 hrs"
            }
        }
    )
    db.add(dna)
    
    # 11. Self Optimization Proposal
    opt = OptimizationProposal(
        workflow_id=wf_scholarship.id,
        title="Eliminate Duplicate Manual Income Verification",
        issue_description="Finance verification step duplicates income tax verification already conducted by DocumentAgent.",
        proposal_text="Auto-pass financial verification if income certificate digital signature matches tax database API.",
        projected_time_reduction_pct=31.0,
        projected_task_reduction_pct=18.0,
        status="proposed"
    )
    db.add(opt)
    
    # 12. Initial Audit Log
    audit = AuditLog(
        user_id=admin_user.id,
        user_email="admin@forge.edu",
        action="WORKFLOW_PUBLISHED",
        entity="Workflow",
        entity_id=str(wf_scholarship.id),
        details="Published Student Scholarship Application v3.2 with multi-agent validation rules.",
        source="System"
    )
    db.add(audit)
    
    db.commit()
    db.close()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    seed_db()
