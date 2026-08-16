import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Application, Workflow, User, WorkflowTask, DecisionPassport
from app.db.schemas import ApplicationCreate
from app.agents.engine import MultiAgentOrchestrator

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.get("")
def list_applications(db: Session = Depends(get_db)):
    apps = db.query(Application).all()
    results = []
    for a in apps:
        student = db.query(User).filter_by(id=a.applicant_id).first()
        wf = db.query(Workflow).filter_by(id=a.workflow_id).first()
        results.append({
            "id": a.id,
            "title": a.title,
            "applicant_name": student.full_name if student else "Rahul Sharma",
            "student_id": student.student_id_no if student else "STU-2026-881",
            "workflow_name": wf.name if wf else "Student Scholarship Application",
            "status": a.status,
            "current_node_id": a.current_node_id,
            "risk_score": a.risk_score,
            "submitted_at": a.submitted_at.strftime("%Y-%m-%d %H:%M"),
            "sla_due_at": a.sla_due_at.strftime("%Y-%m-%d %H:%M") if a.sla_due_at else "In 14 hrs"
        })
    return results

@router.get("/{app_id}")
def get_application(app_id: str, db: Session = Depends(get_db)):
    a = db.query(Application).filter_by(id=app_id).first()
    if not a:
        # Provide flagship fallback for demo app_id if requested
        a = db.query(Application).first()
    
    student = db.query(User).filter_by(id=a.applicant_id).first()
    wf = db.query(Workflow).filter_by(id=a.workflow_id).first()
    passport = db.query(DecisionPassport).filter_by(application_id=a.id).first()
    
    return {
        "id": a.id,
        "title": a.title,
        "applicant": {
            "name": student.full_name if student else "Rahul Sharma",
            "id_no": student.student_id_no if student else "STU-2026-881",
            "cgpa": student.cgpa if student else 8.7,
            "attendance": student.attendance_pct if student else 89.0,
            "annual_income": student.annual_income if student else 320000.0
        },
        "workflow": wf.name if wf else "Student Scholarship Application",
        "status": a.status,
        "current_node_id": a.current_node_id,
        "risk_score": a.risk_score,
        "submitted_at": a.submitted_at.strftime("%Y-%m-%d %H:%M"),
        "details": a.details_json,
        "passport": passport.passport_data if passport else None,
        "timeline": [
            {"step": "Application Submitted", "status": "completed", "timestamp": "10 hrs ago"},
            {"step": "AI Document Verification", "status": "completed", "agent": "DocumentAgent", "timestamp": "8 hrs ago"},
            {"step": "Academic Eligibility Audit", "status": "completed", "agent": "AcademicAgent", "timestamp": "6 hrs ago"},
            {"step": "Financial & Fee Check", "status": "completed", "agent": "FinanceAgent", "timestamp": "4 hrs ago"},
            {"step": "Dean Sanction & Approval", "status": "in_progress", "assigned_to": "Officer B (Finance)", "sla": "Due in 14 hrs"},
            {"step": "Multi-Channel Alert", "status": "pending"}
        ]
    }

@router.post("/submit")
def submit_scholarship_application(req: ApplicationCreate, db: Session = Depends(get_db)):
    app_count = db.query(Application).count() + 1
    new_id = f"SCH-2048{app_count}"
    
    student = db.query(User).filter_by(role="Student").first()
    
    # Run multi-agent pipeline
    agent_output = MultiAgentOrchestrator.run_pipeline({
        "annual_income": req.annual_income or student.annual_income or 320000.0,
        "cgpa": req.cgpa or student.cgpa or 8.7,
        "attendance_pct": req.attendance_pct or student.attendance_pct or 89.0
    })
    
    new_app = Application(
        id=new_id,
        applicant_id=student.id,
        workflow_id=req.workflow_id,
        title=req.title,
        status="pending_human_review",
        current_node_id="node-approval",
        risk_score=agent_output["risk_score"],
        sla_due_at=datetime.datetime.utcnow() + datetime.timedelta(hours=14),
        submitted_at=datetime.datetime.utcnow(),
        details_json={
            "scholarship_name": req.title,
            "amount_per_year": 50000,
            "annual_income": req.annual_income or student.annual_income,
            "cgpa": req.cgpa or student.cgpa,
            "attendance": req.attendance_pct or student.attendance_pct
        }
    )
    db.add(new_app)
    
    # Add Decision Passport
    passport = DecisionPassport(
        application_id=new_id,
        passport_data={
            "request_id": new_id,
            "applicant": f"{student.full_name} ({student.student_id_no})",
            "workflow": "Student Scholarship Application",
            "agent_evaluations": agent_output["agents"],
            "overall_recommendation": agent_output["decision"],
            "overall_confidence": agent_output["overall_confidence"],
            "risk_level": "LOW",
            "risk_score": agent_output["risk_score"],
            "requires_human_approval": True,
            "human_approval_reason": agent_output["routing"]["reason"]
        }
    )
    db.add(passport)
    
    # Add Officer Task
    officer_b = db.query(User).filter_by(email="officer.b@forge.edu").first()
    task = WorkflowTask(
        application_id=new_id,
        node_id="node-approval",
        title=f"Scholarship Final Approval: {student.full_name}",
        assigned_role="Officer",
        assigned_user_id=officer_b.id if officer_b else 3,
        department="Finance & Accounts",
        status="pending",
        priority="high",
        ai_recommendation=f"{agent_output['decision']} ({agent_output['overall_confidence']*100:.0f}% Confidence)",
        ai_confidence=agent_output["overall_confidence"],
        sla_due_at=datetime.datetime.utcnow() + datetime.timedelta(hours=14)
    )
    db.add(task)
    db.commit()
    
    return {
        "message": "Scholarship Application submitted successfully",
        "application_id": new_id,
        "multi_agent_pipeline": agent_output
    }
