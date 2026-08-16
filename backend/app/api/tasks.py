import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import WorkflowTask, Application, AuditLog, DecisionPassport
from app.db.schemas import TaskActionRequest

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.get("")
def list_tasks(db: Session = Depends(get_db)):
    tasks = db.query(WorkflowTask).all()
    results = []
    for t in tasks:
        passport = db.query(DecisionPassport).filter_by(application_id=t.application_id).first()
        results.append({
            "id": t.id,
            "application_id": t.application_id,
            "title": t.title,
            "department": t.department,
            "priority": t.priority,
            "status": t.status,
            "ai_recommendation": t.ai_recommendation,
            "ai_confidence": t.ai_confidence,
            "sla_due": "Due in 14 hrs",
            "passport": passport.passport_data if passport else None
        })
    return results

@router.post("/{task_id}/action")
def perform_task_action(task_id: int, req: TaskActionRequest, db: Session = Depends(get_db)):
    t = db.query(WorkflowTask).filter_by(id=task_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Task not found")
        
    app = db.query(Application).filter_by(id=t.application_id).first()
    
    if req.action == "approve":
        t.status = "completed"
        t.completed_at = datetime.datetime.utcnow()
        if app:
            app.status = "approved"
            app.current_node_id = "node-end"
            
        audit = AuditLog(
            action="TASK_APPROVED",
            entity="WorkflowTask",
            entity_id=str(t.id),
            details=f"Task '{t.title}' approved by Officer. Application '{t.application_id}' sanctioned.",
            source="Officer / Staff UI"
        )
        db.add(audit)
        db.commit()
        return {"message": "Task approved successfully. Sanction letter generated.", "status": "approved"}

    elif req.action == "reject":
        t.status = "completed"
        if app:
            app.status = "rejected"
        audit = AuditLog(
            action="TASK_REJECTED",
            entity="WorkflowTask",
            entity_id=str(t.id),
            details=f"Task '{t.title}' rejected by Officer. Reason: {req.notes or 'Ineligible'}",
            source="Officer / Staff UI"
        )
        db.add(audit)
        db.commit()
        return {"message": "Task rejected.", "status": "rejected"}
        
    elif req.action == "reassign":
        t.assigned_user_id = req.target_user_id or 3
        audit = AuditLog(
            action="TASK_REASSIGNED",
            entity="WorkflowTask",
            entity_id=str(t.id),
            details=f"Task '{t.title}' reassigned to Officer B to prevent SLA bottleneck.",
            source="Intelligent Routing Engine"
        )
        db.add(audit)
        db.commit()
        return {"message": "Task reassigned to Officer B.", "status": "reassigned"}
        
    return {"message": "Action recorded."}
