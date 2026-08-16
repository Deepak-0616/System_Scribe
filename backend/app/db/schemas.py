from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any, Dict
from datetime import datetime

class UserBase(BaseModel):
    email: str
    full_name: str
    role: str
    department_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    student_id_no: Optional[str] = None
    cgpa: Optional[float] = None
    attendance_pct: Optional[float] = None
    annual_income: Optional[float] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class LoginRequest(BaseModel):
    email: str
    password: str

class WorkflowNodeSchema(BaseModel):
    id: str
    type: str
    label: str
    department: str
    role: str
    agent: str
    sla_hours: int = 12
    requires_human: bool = False
    rules: Optional[List[str]] = None

class WorkflowEdgeSchema(BaseModel):
    source: str
    target: str
    condition: Optional[str] = None

class WorkflowCreateRequest(BaseModel):
    name: str
    description: str
    domain: str = "Educational Institution"
    nodes: List[WorkflowNodeSchema]
    edges: List[WorkflowEdgeSchema]

class AIGenerateRequest(BaseModel):
    prompt: str

class ApplicationCreate(BaseModel):
    workflow_id: int
    title: str
    student_name: Optional[str] = None
    annual_income: Optional[float] = None
    cgpa: Optional[float] = None
    attendance_pct: Optional[float] = None

class TaskActionRequest(BaseModel):
    action: str # approve, reject, reassign, request_info
    target_user_id: Optional[int] = None
    notes: Optional[str] = None

class CopilotChatRequest(BaseModel):
    message: str
    user_role: str
