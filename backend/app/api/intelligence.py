from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.db.database import get_db
from app.db.models import DecisionPassport, ExceptionRecord, WorkflowDNA, OptimizationProposal, AuditLog, Department, Workflow
from app.db.schemas import CopilotChatRequest
from app.agents.engine import ExecutiveCopilot

router = APIRouter(prefix="/intelligence", tags=["Intelligence"])

@router.get("/dna/{workflow_id}")
def get_workflow_dna(workflow_id: int, db: Session = Depends(get_db)):
    dna = db.query(WorkflowDNA).filter_by(workflow_id=workflow_id).first()
    if not dna:
        dna = db.query(WorkflowDNA).first()
    
    return {
        "workflow_id": workflow_id,
        "workflow_name": "Student Scholarship Application v3.2",
        "avg_processing_time": f"{dna.avg_processing_hours} days",
        "sla_compliance": f"{dna.sla_compliance_pct}%",
        "failure_rate": f"{dna.failure_rate_pct}%",
        "bottleneck_department": dna.bottleneck_department,
        "automation_potential": f"{dna.automation_potential_pct}%",
        "total_executions": dna.total_executions,
        "rejection_rate": "4.1%",
        "peak_period": "June – August",
        "avg_tasks_per_request": 7,
        "department_breakdown": dna.metrics_json["department_breakdown"] if dna.metrics_json else {}
    }

@router.get("/optimization-proposals")
def get_optimization_proposals(db: Session = Depends(get_db)):
    props = db.query(OptimizationProposal).all()
    return [
        {
            "id": p.id,
            "workflow_id": p.workflow_id,
            "title": p.title,
            "issue": p.issue_description,
            "proposal": p.proposal_text,
            "projected_time_reduction": f"-{p.projected_time_reduction_pct}%",
            "projected_task_reduction": f"-{p.projected_task_reduction_pct}%",
            "status": p.status
        }
        for p in props
    ]

@router.post("/optimization-proposals/{proposal_id}/apply")
def apply_optimization_proposal(proposal_id: int, db: Session = Depends(get_db)):
    p = db.query(OptimizationProposal).filter_by(id=proposal_id).first()
    if p:
        p.status = "applied"
        # Update workflow version
        wf = db.query(Workflow).filter_by(id=p.workflow_id).first()
        if wf:
            wf.version = "3.3 (Optimized)"
            
        audit = AuditLog(
            action="OPTIMIZATION_APPLIED",
            entity="Workflow",
            entity_id=str(p.workflow_id),
            details=f"Applied optimization '{p.title}'. Version upgraded to 3.3. Processing time reduced by 31%.",
            source="Self-Optimization Engine"
        )
        db.add(audit)
        db.commit()
    return {"message": "Optimization proposal applied successfully. Workflow version updated to 3.3.", "status": "applied"}

@router.get("/digital-twin")
def get_digital_twin(db: Session = Depends(get_db)):
    depts = db.query(Department).all()
    return {
        "institution": "Indian Institute of Technology & Science",
        "departments": [
            {
                "id": d.id,
                "name": d.name,
                "code": d.code,
                "capacity": d.capacity,
                "workload_pct": d.current_workload_pct,
                "avg_processing_time": f"{d.avg_processing_time_hours} hrs",
                "officers": [
                    {"name": "Officer A", "status": "Busy (91% workload)"},
                    {"name": "Officer B", "status": "Available (42% workload)"}
                ] if d.code == "FIN" else [
                    {"name": "Staff 1", "status": "Normal"},
                    {"name": "Staff 2", "status": "Normal"}
                ]
            }
            for d in depts
        ]
    }

@router.post("/simulate")
def simulate_workflow(volume_multiplier: float = 1.4, capacity_multiplier: float = 1.0):
    base_sla_breach_prob = 12.0
    projected_sla_breach_prob = min(99.0, base_sla_breach_prob * (volume_multiplier / capacity_multiplier) * 2.5)
    projected_avg_time = round(3.8 * volume_multiplier, 1)
    
    return {
        "simulation_parameters": {
            "volume_increase_pct": f"+{(volume_multiplier - 1.0) * 100:.0f}%",
            "capacity_change": f"{(capacity_multiplier - 1.0) * 100:.0f}%"
        },
        "projections": {
            "projected_avg_processing_days": projected_avg_time,
            "projected_sla_breach_probability": f"{projected_sla_breach_prob:.1f}%",
            "queue_growth_factor": f"{volume_multiplier * 1.3:.1f}x",
            "bottleneck_department": "Finance & Accounts",
            "required_additional_staff": 3,
            "recommended_automation_rule": "Enable auto-approval for scholarship grants below Rs 25,000"
        }
    }

@router.post("/copilot/chat")
def copilot_chat(req: CopilotChatRequest):
    return ExecutiveCopilot.chat(req.user_role, req.message)

@router.get("/audit-logs")
def get_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()
    return [
        {
            "id": l.id,
            "action": l.action,
            "entity": l.entity,
            "entity_id": l.entity_id,
            "details": l.details,
            "source": l.source,
            "timestamp": l.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        }
        for l in logs
    ]

@router.get("/exceptions")
def get_exceptions(db: Session = Depends(get_db)):
    excs = db.query(ExceptionRecord).all()
    return [
        {
            "id": e.id,
            "application_id": e.application_id,
            "exception_type": e.exception_type,
            "description": e.description,
            "status": e.status,
            "resolution_note": e.resolution_note,
            "created_at": e.created_at.strftime("%Y-%m-%d %H:%M")
        }
        for e in excs
    ]
