from sqlalchemy import Column, Integer, String, Text, Date, BLOB, ForeignKey, DateTime
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)

    first_name = Column(String(63))
    last_name = Column(String(63))
    ucid = Column(String(63), nullable=True)
    email = Column(String(63), primary_key=True)
    phone = Column(String(63))
    roles = Column(String(63))
    major = Column(String(63), nullable=True)
    minor = Column(String(63), nullable=True)
    specialization = Column(String(63), nullable=True)
    resume = Column(BLOB, nullable=True)
    position_title = Column(String(63), nullable=True)
    org_name = Column(String(63), nullable=True)
    org_category = Column(String(63), nullable=True)
    org_industry = Column(String(63), nullable=True)
    org_website = Column(String(63), nullable=True)
    org_address = Column(String(63), nullable=True)
    track = Column(String(63), nullable=True)
    applied_projects = Column(String(255), nullable=True)
    approved_projects = Column(String(255), nullable=True)
    committed_project = Column(String(255), nullable=True)
    project_manager = Column(String(15), nullable=True)
    password = Column(String(255), nullable=False)

class Project(Base):
    __tablename__ = 'projects'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    approved = Column(String(1))
    year = Column(Integer)
    semester = Column(String(63))
    org_name = Column(String(63))
    org_category = Column(String(63))
    org_industry = Column(String(63))
    org_website = Column(String(63))
    org_address = Column(String(255))
    
    contact_first_name = Column(String(63))
    contact_last_name = Column(String(63))
    contact_position_title = Column(String(63))
    contact_phone = Column(String(63))
    contact_email = Column(String(63))
    
    org_document = Column(BLOB, nullable=True)
    project_document = Column(BLOB, nullable=True)
    agreement_document = Column(BLOB, nullable=True)
    
    project_name = Column(String(255))
    project_description = Column(Text)
    project_criteria = Column(Text)
    project_skillset = Column(Text)
    project_instructions = Column(Text)
    project_benefits = Column(String(255))
    open_house = Column(String(63))  
    
    employment_history = Column(String(255))
    employment_opportunities = Column(String(255))
    employment_benefits = Column(String(255))
    
    committed = Column(String(63))  
    other_projects = Column(String(255))  
    applied_students = Column(String(255)) 
    approved_students = Column(String(255)) 
    confirmed_students = Column(String(255))  


class TrackRequest(Base):
    __tablename__ = 'track_requests'
    id = Column(Integer, primary_key=True, autoincrement=True) #SQLAlchemy needs PK
    date = Column(Date)
    track = Column(String(63))


class Approval(Base):
    __tablename__ = 'approvals'

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id   = Column(Integer, ForeignKey('projects.id'), nullable=False)
    user_id      = Column(Integer, ForeignKey('users.id'),    nullable=False)
    submitter_id = Column(Integer, ForeignKey('users.id'),    nullable=False)
    created_at   = Column(DateTime, nullable=False, default=datetime.utcnow)

