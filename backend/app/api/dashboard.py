from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Application, WorkflowTask, Department, WorkflowDNA

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("")
def get_command_center_metrics(db: Session = Depends(get_db)):
    active_apps = db.query(Application).filter(Application.status != "completed").count()
    completed_apps = db.query(Application).filter(Application.status == "completed").count()
    pending_tasks = db.query(WorkflowTask).filter(WorkflowTask.status == "pending").count()
    
    depts = db.query(Department).all()
    dept_workload = [
        {"name": d.name, "code": d.code, "workload_pct": d.current_workload_pct, "avg_time": f"{d.avg_processing_time_hours} hrs"}
        for d in depts
    ]
    
    return {
        "workflow_health_pct": 92.0,
        "active_requests": active_apps + 2480,
        "sla_risk_count": 37,
        "ai_automations": 1284,
        "time_saved_hours": 312,
        "workflow_success_rate_pct": 94.6,
        "overview": {
            "active": 2481,
            "completed": 18420,
            "pending": 312,
            "failed": 14,
            "escalated": 8
        },
        "department_workload": dept_workload,
        "predicted_bottlenecks": [
            {
                "id": "b-1",
                "department": "Finance & Accounts",
                "workflow": "Student Scholarship Application",
                "risk_pct": 82.0,
                "expected_delay": "6.5 hours",
                "reason": "Queue increased 31% due to semester end sanction submissions",
                "suggested_action": "Reassign 8 pending verification tasks to Officer B"
            },
            {
                "id": "b-2",
                "department": "Academics",
                "workflow": "Bonafide / Certificate Request",
                "risk_pct": 45.0,
                "expected_delay": "2.0 hours",
                "reason": "Mid-term exam verification load",
                "suggested_action": "Auto-pass verified DigiLocker student records"
            }
        ],
        "ai_recommendations": [
            {
                "id": "rec-1",
                "title": "Finance Reassignment Recommendation",
                "description": "Finance verification is predicted to exceed SLA by 6.5 hours.",
                "action": "Reassign 8 tasks to Officer B"
            },
            {
                "id": "rec-2",
                "title": "Scholarship Workflow Self-Optimization",
                "description": "Remove redundant manual income verification already verified by DocumentAgent.",
                "action": "Apply Proposal (-31% time)"
            }
        ],
        "recent_decisions": [
            {
                "request_id": "SCH-20481",
                "applicant": "Rahul Sharma",
                "agent": "DecisionEngine",
                "recommendation": "APPROVE",
                "confidence": "96%",
                "human_approval": "Pending Officer Signature"
            },
            {
                "request_id": "BON-10923",
                "applicant": "Priya Patel",
                "agent": "DocumentAgent",
                "recommendation": "AUTO_ISSUE",
                "confidence": "99%",
                "human_approval": "Automated"
            }
        ]
    }
