from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User
from app.db.schemas import LoginRequest, Token, UserResponse

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login", response_model=Token)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        # Fallback helper for quick demo role selection
        if "student" in req.email:
            user = db.query(User).filter(User.role == "Student").first()
        elif "officer" in req.email:
            user = db.query(User).filter(User.role == "Officer").first()
        elif "admin" in req.email:
            user = db.query(User).filter(User.role == "Admin").first()
        elif "dean" in req.email:
            user = db.query(User).filter(User.role == "DepartmentHead").first()
            
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    user_resp = UserResponse.from_orm(user)
    return Token(
        access_token=f"demo_token_user_{user.id}",
        token_type="bearer",
        user=user_resp
    )

@router.get("/me", response_model=UserResponse)
def get_current_user(email: str = "student@forge.edu", db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = db.query(User).first()
    return UserResponse.from_orm(user)
