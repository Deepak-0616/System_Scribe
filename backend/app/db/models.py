import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    code = Column(String, unique=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String)
    org_id = Column(Integer, ForeignKey("organizations.id"))
    capacity = Column(Integer, default=50)
    current_workload_pct = Column(Float, default=50.0)
    avg_processing_time_hours = Column(Float, default=14.0)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String, index=True) # Student, Officer, Admin, DepartmentHead
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Extra role details
    student_id_no = Column(String, nullable=True)
    cgpa = Column(Float, nullable=True)
    attendance_pct = Column(Float, nullable=True)
    annual_income = Column(Float, nullable=True)

class Workflow(Base):
    __tablename__ = "workflows"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    domain = Column(String, default="Educational Institution")
    version = Column(String, default="1.0")
    status = Column(String, default="published") # draft, published, archived
    sla_hours = Column(Integer, default=48)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    nodes = relationship("WorkflowNode", back_populates="workflow", cascade="all, delete-orphan")
    edges = relationship("WorkflowEdge", back_populates="workflow", cascade="all, delete-orphan")

class WorkflowNode(Base):
    __tablename__ = "workflow_nodes"
    
    id = Column(String, primary_key=True) # e.g. "node-1"
    workflow_id = Column(Integer, ForeignKey("workflows.id"))
    type = Column(String) # start, document_verification, ai_validation, human_review, notification, end, exception
    label = Column(String)
    department = Column(String)
    role = Column(String)
    agent = Column(String)
    sla_hours = Column(Integer, default=12)
    requires_human = Column(Boolean, default=False)
    rules_json = Column(JSON, nullable=True)
    
    workflow = relationship("Workflow", back_populates="nodes")

class WorkflowEdge(Base):
    __tablename__ = "workflow_edges"
    
    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(Integer, ForeignKey("workflows.id"))
    source = Column(String)
    target = Column(String)
    condition = Column(String, nullable=True)
    
    workflow = relationship("Workflow", back_populates="edges")

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(String, primary_key=True) # e.g. "APP-SCH-20481"
    applicant_id = Column(Integer, ForeignKey("users.id"))
    workflow_id = Column(Integer, ForeignKey("workflows.id"))
    title = Column(String)
    status = Column(String, default="in_progress") # submitted, in_progress, pending_human_review, exception, approved, rejected
    current_node_id = Column(String, default="node-start")
    risk_score = Column(Float, default=0.05)
    sla_due_at = Column(DateTime)
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    details_json = Column(JSON, nullable=True)

class WorkflowTask(Base):
    __tablename__ = "workflow_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(String, ForeignKey("applications.id"))
    node_id = Column(String)
    title = Column(String)
    assigned_role = Column(String)
    assigned_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    department = Column(String)
    status = Column(String, default="pending") # pending, completed, escalated, exception
    priority = Column(String, default="medium") # urgent, high, medium, low
    ai_recommendation = Column(String, nullable=True)
    ai_confidence = Column(Float, nullable=True)
    sla_due_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

class DecisionPassport(Base):
    __tablename__ = "decision_passports"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(String, ForeignKey("applications.id"), unique=True)
    passport_data = Column(JSON) # Structured evidence, risk scores, rule outputs
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ExceptionRecord(Base):
    __tablename__ = "exception_records"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(String, ForeignKey("applications.id"))
    exception_type = Column(String) # missing_document, data_conflict, sla_breach, system_error
    description = Column(Text)
    status = Column(String, default="open") # open, investigating, resolved
    resolution_note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class WorkflowDNA(Base):
    __tablename__ = "workflow_dna"
    
    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(Integer, ForeignKey("workflows.id"), unique=True)
    avg_processing_hours = Column(Float, default=3.8)
    sla_compliance_pct = Column(Float, default=91.0)
    failure_rate_pct = Column(Float, default=7.2)
    bottleneck_department = Column(String, default="Finance")
    automation_potential_pct = Column(Float, default=68.0)
    total_executions = Column(Integer, default=1240)
    metrics_json = Column(JSON, nullable=True)

class OptimizationProposal(Base):
    __tablename__ = "optimization_proposals"
    
    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(Integer, ForeignKey("workflows.id"))
    title = Column(String)
    issue_description = Column(Text)
    proposal_text = Column(Text)
    projected_time_reduction_pct = Column(Float, default=31.0)
    projected_task_reduction_pct = Column(Float, default=18.0)
    status = Column(String, default="proposed") # proposed, approved, rejected, applied
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    user_email = Column(String, nullable=True)
    action = Column(String)
    entity = Column(String)
    entity_id = Column(String, nullable=True)
    details = Column(Text, nullable=True)
    source = Column(String, default="System")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
