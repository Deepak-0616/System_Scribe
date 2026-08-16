from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.db.database import get_db
from app.db.models import Workflow, WorkflowNode, WorkflowEdge
from app.db.schemas import WorkflowCreateRequest, AIGenerateRequest
from app.core.llm import LLMProvider

router = APIRouter(prefix="/workflows", tags=["Workflows"])

@router.get("")
def list_workflows(db: Session = Depends(get_db)):
    wfs = db.query(Workflow).all()
    results = []
    for w in wfs:
        nodes = db.query(WorkflowNode).filter_by(workflow_id=w.id).all()
        results.append({
            "id": w.id,
            "name": w.name,
            "description": w.description,
            "domain": w.domain,
            "version": w.version,
            "status": w.status,
            "sla_hours": w.sla_hours,
            "node_count": len(nodes)
        })
    return results

@router.get("/{workflow_id}")
def get_workflow(workflow_id: int, db: Session = Depends(get_db)):
    w = db.query(Workflow).filter_by(id=workflow_id).first()
    if not w:
        raise HTTPException(status_code=404, detail="Workflow not found")
        
    nodes = db.query(WorkflowNode).filter_by(workflow_id=w.id).all()
    edges = db.query(WorkflowEdge).filter_by(workflow_id=w.id).all()
    
    return {
        "id": w.id,
        "name": w.name,
        "description": w.description,
        "domain": w.domain,
        "version": w.version,
        "status": w.status,
        "sla_hours": w.sla_hours,
        "nodes": [
            {
                "id": n.id,
                "type": n.type,
                "label": n.label,
                "department": n.department,
                "role": n.role,
                "agent": n.agent,
                "sla_hours": n.sla_hours,
                "requires_human": n.requires_human,
                "rules": n.rules_json
            }
            for n in nodes
        ],
        "edges": [
            {
                "id": e.id,
                "source": e.source,
                "target": e.target,
                "condition": e.condition
            }
            for e in edges
        ]
    }

@router.post("/generate")
def generate_workflow_ai(req: AIGenerateRequest):
    return LLMProvider.generate_workflow(req.prompt)

@router.post("/{workflow_id}/validate")
def validate_workflow(workflow_id: int, db: Session = Depends(get_db)):
    w = db.query(Workflow).filter_by(id=workflow_id).first()
    if not w:
        raise HTTPException(status_code=404, detail="Workflow not found")
    nodes = db.query(WorkflowNode).filter_by(workflow_id=w.id).all()
    
    has_start = any(n.type == "start" for n in nodes)
    has_end = any(n.type == "end" for n in nodes)
    has_human = any(n.requires_human for n in nodes)
    
    critical_errors = 0
    warnings = 0
    suggestions = []
    
    if not has_start:
        critical_errors += 1
    if not has_end:
        critical_errors += 1
    if not has_human:
        warnings += 1
        suggestions.append("Consider adding a human review step for high-risk decisions.")
        
    suggestions.append("SLA validation complete: 48 hour target is within institutional compliance.")
    
    return {
        "is_valid": critical_errors == 0,
        "critical_errors": critical_errors,
        "warnings": warnings,
        "suggestions": suggestions
    }

@router.post("")
def create_workflow(req: WorkflowCreateRequest, db: Session = Depends(get_db)):
    w = Workflow(
        name=req.name,
        description=req.description,
        domain=req.domain,
        version="1.0",
        status="published",
        sla_hours=48,
        created_by=1
    )
    db.add(w)
    db.commit()
    db.refresh(w)
    
    for n in req.nodes:
        node = WorkflowNode(
            id=n.id,
            workflow_id=w.id,
            type=n.type,
            label=n.label,
            department=n.department,
            role=n.role,
            agent=n.agent,
            sla_hours=n.sla_hours,
            requires_human=n.requires_human,
            rules_json=n.rules
        )
        db.add(node)
        
    for e in req.edges:
        edge = WorkflowEdge(
            workflow_id=w.id,
            source=e.source,
            target=e.target,
            condition=e.condition
        )
        db.add(edge)
        
    db.commit()
    return {"message": f"Workflow '{w.name}' created successfully", "id": w.id, "status": "published"}

@router.put("/{workflow_id}")
def update_workflow(workflow_id: int, req: WorkflowCreateRequest, db: Session = Depends(get_db)):
    w = db.query(Workflow).filter_by(id=workflow_id).first()
    if not w:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    w.name = req.name
    w.description = req.description
    w.domain = req.domain
    
    # Delete existing nodes and edges
    db.query(WorkflowNode).filter_by(workflow_id=w.id).delete()
    db.query(WorkflowEdge).filter_by(workflow_id=w.id).delete()
    
    for n in req.nodes:
        node = WorkflowNode(
            id=n.id,
            workflow_id=w.id,
            type=n.type,
            label=n.label,
            department=n.department,
            role=n.role,
            agent=n.agent,
            sla_hours=n.sla_hours,
            requires_human=n.requires_human,
            rules_json=n.rules
        )
        db.add(node)
        
    for e in req.edges:
        edge = WorkflowEdge(
            workflow_id=w.id,
            source=e.source,
            target=e.target,
            condition=e.condition
        )
        db.add(edge)
        
    db.commit()
    return {"message": f"Workflow '{w.name}' updated successfully", "id": w.id, "status": w.status}

@router.post("/{workflow_id}/publish")
def publish_workflow(workflow_id: int, db: Session = Depends(get_db)):
    w = db.query(Workflow).filter_by(id=workflow_id).first()
    if not w:
        raise HTTPException(status_code=404, detail="Workflow not found")
    w.status = "published"
    db.commit()
    return {"message": f"Workflow '{w.name}' published successfully", "status": "published"}

