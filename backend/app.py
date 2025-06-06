from flask import Flask, request, jsonify
from flask_cors import CORS
from db import Session
from models import User, Project, TrackRequest, Approval
import json
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": "Flask Backend is Running!"})

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    session = Session()

    try:
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
        new_user = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            phone=data['phone'],

            password=hashed_password,

            ucid=data['ucid'],
            roles=data['roles'],
            major=data['major'],
            minor=data['minor'],
            specialization=data['specialization'],


            position_title=data.get('position_title'),
            org_name=data.get('org_name'),
            org_category=data.get('org_category'),
            org_industry=data.get('org_industry'),
            org_website=data.get('org_website'),
            org_address=data.get('org_address'),
        )
        session.add(new_user)
        session.commit()
        return jsonify({"message": "New user registered successfully!"}), 201
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        session.close()

@app.route('/register-student', methods=['POST'])
def register_student():
    data = request.get_json()
    session = Session()

    try:
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
        new_student = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            ucid=data['ucid'],
            email=data['email'],
            phone=data['phone'],
            password=hashed_password,
            roles='student',
            major=data['major'],
            minor=data['minor'],
            specialization=data['specialization']
        )
        session.add(new_student)
        session.commit()
        return jsonify({"message": "Student registered successfully!"}), 201
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        session.close()

@app.route('/register-sponsor', methods=['POST'])
def register_sponsor():
    data = request.get_json()
    session = Session()

    try:
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
        new_sponsor = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            phone=data['phone'],
            password=hashed_password,
            roles='sponsor',
            position_title=data.get('position_title'),
            org_name=data.get('org_name'),
            org_category=data.get('org_category'),
            org_industry=data.get('org_industry'),
            org_website=data.get('org_website'),
            org_address=data.get('org_address'),
            
            # explicitly set student fields as None
            ucid=None,
            major=None,
            minor=None,
            specialization=None,
            resume=None,
            track=None,
            applied_projects=None,
            approved_projects=None,
            committed_project=None,
            project_manager=None
        )
        session.add(new_sponsor)
        session.commit()
        return jsonify({"message": "Sponsor registered successfully!"}), 201
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        session.close()
        
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    session = Session()

    try:
        user = session.query(User).filter_by(email=data['email']).first()

        if user and check_password_hash(user.password, data['password']):
            user_data = {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "roles": user.roles,
                "track": user.track,
                "applied_projects": user.applied_projects,
                "approved_projects": user.approved_projects,
                "committed_project": user.committed_project,
                "project_manager": user.project_manager
            }
            return jsonify({
                "message": "Login successful!",
                "user": user_data
            }), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

@app.route('/users', methods=['GET'])
def get_all_users():
    session = Session()

    try:
        users = session.query(User).all()

        user_data = [{
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "ucid": user.ucid,
            "email": user.email,
            "phone": user.phone,
            "roles": user.roles,
            "major": user.major,
            "minor": user.minor,
            "specialization": user.specialization,
            "resume": user.resume,
            "position_title": user.position_title,
            "org_name": user.org_name,
            "org_category": user.org_category,
            "org_industry": user.org_industry,
            "org_website": user.org_website,
            "org_address": user.org_address,
            "track": user.track,
            "applied_projects": user.applied_projects,
            "approved_projects": user.approved_projects,
            "committed_project": user.committed_project,
            "project_manager": user.project_manager,
            "password": user.password 
        } for user in users]

        return jsonify(user_data), 200  

    except Exception as e:
        return jsonify({"error": str(e)}), 500  
    finally:
        session.close()

@app.route('/projects', methods=['GET'])
def get_all_projects():
    session = Session()
    try:
        projects = session.query(Project).all()

        print("GETTING PROJECTS")

        project_data = [{
            "id": project.id,
            "approved": project.approved,
            "year": project.year,
            "semester": project.semester,
            "org_name": project.org_name,
            "org_category": project.org_category,
            "org_industry": project.org_industry,
            "org_website": project.org_website,
            "org_address": project.org_address,
            "contact_first_name": project.contact_first_name,
            "contact_last_name": project.contact_last_name,
            "contact_position_title": project.contact_position_title,
            "contact_phone": project.contact_phone,
            "contact_email": project.contact_email,
            #"org_document": project.org_document,
            #"project_document": project.project_document,
            #"agreement_document": project.agreement_document,
            "project_name": project.project_name,
            "project_description": project.project_description,
            "project_criteria": project.project_criteria,
            "project_skillset": project.project_skillset,
            "project_instructions": project.project_instructions,
            "open_house": project.open_house,
            "employment_history": project.employment_history,
            "employment_opportunities": project.employment_opportunities,
            "employment_benefits": project.employment_benefits,
            "committed": project.committed,
            "other_projects": project.other_projects,
            "applied_students": project.applied_students,
            "approved_students": project.approved_students,
            "confirmed_students": project.confirmed_students
        } for project in projects]

        return jsonify(project_data), 200  

    except Exception as e:
        return jsonify({"error": str(e)}), 500  
    finally:
        session.close()

@app.route('/user/<int:id>', methods=['GET'])
def get_one_user(id):
    session = Session()

    try:
        user = session.query(User).filter_by(id=id).first()

        if user:
            user_data = {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "ucid": user.ucid,
                "email": user.email,
                "phone": user.phone,
                "roles": user.roles,
                "major": user.major,
                "minor": user.minor,
                "specialization": user.specialization,
                "resume": user.resume,
                "position_title": user.position_title,
                "org_name": user.org_name,
                "org_category": user.org_category,
                "org_industry": user.org_industry,
                "org_website": user.org_website,
                "org_address": user.org_address,
                "track": user.track,
                "applied_projects": user.applied_projects,
                "approved_projects": user.approved_projects,
                "committed_project": user.committed_project,
                "project_manager": user.project_manager,
                "password": user.password 
            }
            return jsonify(user_data), 200  
        else:
            return jsonify({"error": "User not found"}), 404  

    except Exception as e:
        return jsonify({"error": str(e)}), 500  
    finally:
        session.close()


@app.route('/project/<int:id>', methods=['GET'])
def get_one_project(id):
    session = Session()

    try:
        project = session.query(Project).filter_by(id=id).first()

        if project:
            project_data = {
                "id": project.id,
                "approved": project.approved,
                "year": project.year,
                "semester": project.semester,
                "org_name": project.org_name,
                "org_category": project.org_category,
                "org_industry": project.org_industry,
                "org_website": project.org_website,
                "org_address": project.org_address,
                "contact_first_name": project.contact_first_name,
                "contact_last_name": project.contact_last_name,
                "contact_position_title": project.contact_position_title,
                "contact_phone": project.contact_phone,
                "contact_email": project.contact_email,
                #"org_document": project.org_document,
                #"project_document": project.project_document,
                #"agreement_document": project.agreement_document,
                "project_name": project.project_name,
                "project_description": project.project_description,
                "project_criteria": project.project_criteria,
                "project_skillset": project.project_skillset,
                "project_instructions": project.project_instructions,
                "open_house": project.open_house,
                "employment_history": project.employment_history,
                "employment_opportunities": project.employment_opportunities,
                "employment_benefits": project.employment_benefits,
                "committed": project.committed,
                "other_projects": project.other_projects,
                "applied_students": project.applied_students,
                "approved_students": project.approved_students,
                "confirmed_students": project.confirmed_students
            }
            print(project_data)
            return jsonify(project_data), 200  
        else:
            return jsonify({"error": "Project not found"}), 404  

    except Exception as e:
        return jsonify({"error": str(e)}), 500 
    finally:
        session.close()

@app.route('/createproject', methods=['POST'])
def create_project():
    data = request.get_json()
    session = Session()

    try:
        # Extracting form fields from the request
        year = data['year']
        semester = data['semester']

        org_name = data['org_name']
        org_category = data['org_category']
        org_industry = data['org_industry']
        org_website = data['org_website']
        org_address = data['org_address']
        #org_document = request.files['org_document'].read() 

        contact_first_name = data['contact_first_name']
        contact_last_name = data['contact_last_name']
        contact_position_title = data['contact_position_title']
        contact_phone = data['contact_phone']
        contact_email = data['contact_email']

        project_name = data['project_name']
        project_description = data['project_description']
        project_criteria = data['project_criteria']
        project_skillset = data['project_skillset']
        project_instructions = data['project_instructions']
        # THIS SHOULD BE: project_benefits
        project_benefits = data['project_benefits']
        #project_document = request.files['project_document'].read() 
        other_projects = data['other_projects']

        open_house = data['open_house']
        employment_history = data['employment_history']
        employment_opportunities = data['employment_opportunities']
        committed = data['committed']
        #agreement_document = request.files['agreement_document'].read() 

        applied_students = data['applied_students']
        approved_students = data['approved_students'] 
        confirmed_students = data['confirmed_students']  

        new_project = Project(
            approved=0,
            year=year,
            semester=semester,
            org_name=org_name,
            org_category=org_category,
            org_industry=org_industry,
            org_website=org_website,
            org_address=org_address,
            contact_first_name=contact_first_name,
            contact_last_name=contact_last_name,
            contact_position_title=contact_position_title,
            contact_phone=contact_phone,
            contact_email=contact_email,
            project_name=project_name,
            project_description=project_description,
            project_criteria=project_criteria,
            project_skillset=project_skillset,
            project_instructions=project_instructions,
            open_house=open_house,
            employment_history=employment_history,
            employment_opportunities=employment_opportunities,
            project_benefits=project_benefits,
            committed=committed,
            other_projects=other_projects,
            applied_students=applied_students,
            approved_students=approved_students,
            confirmed_students=confirmed_students,
            #org_document=org_document,  
            #project_document=project_document, 
            #agreement_document=agreement_document  
        )

        # Add and commit the new project to the database
        session.add(new_project)
        session.commit()

        return jsonify({"message": "Project created successfully!"}), 201

    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400

    finally:
        session.close()


@app.route('/apply/<int:user_id>', methods=['PATCH'])
def apply_to_project(user_id):
    data = request.get_json()
    session = Session()

    try:
        user = session.query(User).filter_by(id=user_id).first()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        applied_projects = user.applied_projects
        
        project_id = data.get("id")
        project = session.query(Project).filter_by(id=project_id).first()

        if not project:
            return jsonify({"error": "Project not found"}), 404

        applied_students = project.applied_students

        if applied_projects:
            applied_projects = json.loads(applied_projects)
        else:
            applied_projects = []

        if applied_students:
            applied_students = json.loads(applied_students)
        else:
            applied_students = []
        
        if len(applied_projects) >= 3:
            return jsonify({"error": "User not allowed to apply to more than 3 projects!"}), 400

        if user.id not in applied_students:
            applied_students.append(user.id)
            applied_projects.append(project.id)
        else:
            applied_students.remove(user.id)
            applied_projects.remove(project.id)

        project.applied_students = json.dumps(applied_students) 
        user.applied_projects = json.dumps(applied_projects) 

        session.commit()

        return jsonify({"message": "User application status updated!"}), 200

    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400

    finally:
        session.close()

@app.route('/approve/<int:project_id>/<int:student_id>', methods=['PATCH'])
def approve_student(project_id, student_id):
    session = Session()

    try:
        project = session.query(Project).filter_by(id=project_id).first()
        if not project:
            return jsonify({"error": "Project not found"}), 404

        student = session.query(User).filter_by(id=student_id).first()
        if not student:
            return jsonify({"error": "Student not found"}), 404

        approved_projects = json.loads(student.approved_projects or "[]")
        approved_students = json.loads(project.approved_students or "[]")

        if project_id in approved_projects:
            # If already approved, remove student
            approved_projects.remove(project_id)
            if student_id in approved_students:
                approved_students.remove(student_id)
            message = "Student unapproved from the project."
        else:
            # If not approved, add student
            approved_projects.append(project_id)
            if student_id not in approved_students:
                approved_students.append(student_id)

            # Create approval record 
            current_user = request.json.get("submitter_id")  

            if not current_user:
                return jsonify({"error": "Missing submitter_id"}), 400

            new_approval = Approval(
                project_id=project_id,
                user_id=student_id,
                submitter_id=current_user,
                created_at=datetime.utcnow()
            )
            session.add(new_approval)

            message = "Student approved for the project."

        student.approved_projects = json.dumps(approved_projects)
        project.approved_students = json.dumps(approved_students)

        session.commit()

        return jsonify({"message": f"✅ {message}"}), 200

    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400

    finally:
        session.close()
        
@app.route('/commit/<int:user_id>', methods=['PATCH'])
def commit_to_project(user_id):
    data = request.get_json()
    session = Session()

    try:
        user = session.query(User).filter_by(id=user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        project_id = data.get("id")
        project = session.query(Project).filter_by(id=project_id).first()
        if not project:
            return jsonify({"error": "Project not found"}), 404

        # Load approved_students list and check if user is approved
        approved_students = json.loads(project.approved_students or "[]")
        if user_id not in approved_students:
            return jsonify({"error": "User is not approved for this project"}), 403

        # Load or initialize confirmed_students
        confirmed_students = json.loads(project.confirmed_students or "[]")

        # Prevent duplicate commits
        if user_id in confirmed_students:
            user.committed_project = ''
            confirmed_students.remove(user_id)
            #return jsonify({"message": "User already committed to this project"}), 200
        else:
            # Commit the student
            user.committed_project = str(project_id)  # store ID as string to match frontend expectations
            confirmed_students.append(user_id)
        
        project.confirmed_students = json.dumps(confirmed_students)

        session.commit()

        return jsonify({"message": "✅ User successfully committed to the project!"}), 200

    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400

    finally:
        session.close()


@app.route('/user/<int:id>', methods=['DELETE'])
def delete_user(id):
    session = Session()
 
    try:
        user = session.query(User).filter_by(id=id).first()

        if not user:
            return jsonify({"error": "User not found"}), 404
        
        if user.applied_projects:
            for project_id in json.loads(user.applied_projects or "[]"):
                project = session.query(Project).filter_by(id=project_id).first()
                if not project:
                    return jsonify({"error": "Project does not have applied user, cannot remove"}), 404
                
                applied_students = json.loads(project.applied_students)
                
                applied_students.remove(user.id)

                project.applied_students = json.dumps(applied_students)

        if user.approved_projects:
            for project_id in json.loads(user.applied_projects or "[]"):
                project = session.query(Project).filter_by(id=project_id).first()
                if not project:
                    return jsonify({"error": "Project does not have approved user, cannot remove"}), 404
                
                approved_students = json.loads(project.approved_students)
                
                approved_students.remove(user.id)

                project.approved_students = json.dumps(approved_students)

        if user.committed_project:
            for user_id in json.loads(project.confirmed_students or "[]"):
                project = session.query(Project).filter_by(id=project_id).first()
                if not project:
                    return jsonify({"error": "Project does not have committed user, cannot remove"}), 404
                
                confirmed_students = json.loads(project.confirmed_students)
                
                confirmed_students.remove(user.id)

                project.confirmed_students = json.dumps(confirmed_students)
            
        session.delete(user)
        session.commit()

        return jsonify({"message": "User deleted successfully!"}), 200
 
    except Exception as e:
         session.rollback()
         return jsonify({"error": str(e)}), 400
 
    finally:
         session.close()

@app.route('/user/<int:id>', methods=['PATCH'])
def update_user(id):
    data = request.get_json()
    session = Session()

    try:
        user = session.query(User).filter_by(id=id).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        # General fields
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.email = data.get('email', user.email)
        user.phone = data.get('phone', user.phone)
        user.roles = data.get('roles', user.roles)

        # Student fields
        user.ucid = data.get('ucid', user.ucid)
        user.major = data.get('major', user.major)
        user.minor = data.get('minor', user.minor)
        user.specialization = data.get('specialization', user.specialization)

        # Sponsor fields 
        user.position_title = data.get('position_title', user.position_title)
        user.org_name = data.get('org_name', user.org_name)
        user.org_category = data.get('org_category', user.org_category)
        user.org_industry = data.get('org_industry', user.org_industry)
        user.org_website = data.get('org_website', user.org_website)
        user.org_address = data.get('org_address', user.org_address)

        session.commit()

        return jsonify({"message": "User updated successfully!"}), 200

    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400

    finally:
        session.close()

@app.route('/project/<int:id>', methods=['DELETE'])
def delete_project(id):
    session = Session()

    try:
        project = session.query(Project).filter_by(id=id).first()

        if not project:
            return jsonify({"error": "Project not found"}), 404
        
        for user_id in json.loads(project.applied_students or "[]"):
            user = session.query(User).filter_by(id=user_id).first()
            if not user:
                return jsonify({"error": "User not applied for project, cannot remove"}), 404
            
            applied_projects = json.loads(user.applied_projects)
            
            applied_projects.remove(project.id)

            user.applied_projects = json.dumps(applied_projects)

        for user_id in json.loads(project.approved_students or "[]"):
            user = session.query(User).filter_by(id=user_id).first()
            if not user:
                return jsonify({"error": "User not approved for project, cannot remove"}), 404
            
            approved_projects = json.loads(user.approved_projects)
            
            approved_projects.remove(project.id)

            user.approved_projects = json.dumps(approved_projects)

        for user_id in json.loads(project.confirmed_students or "[]"):
            user = session.query(User).filter_by(id=user_id).first()
            if not user:
                return jsonify({"error": "User not committed to project, cannot remove"}), 404
            
            user.committed_project = ''
            
        session.delete(project)
        session.commit()

        return jsonify({"message": "Project deleted successfully!"}), 200

    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400

    finally:
        session.close()

@app.route('/project/<int:id>', methods=['PATCH'])
def update_project(id):
    data = request.get_json()
    session = Session()

    try:
        project = session.query(Project).filter_by(id=id).first()

        if not project:
            return jsonify({"error": "Project not found"}), 404

        project.approved = data.get('approved', project.approved)
        project.year = data.get('year', project.year)
        project.semester = data.get('semester', project.semester)
        project.org_name = data.get('org_name', project.org_name)
        project.org_category = data.get('org_category', project.org_category)
        project.org_industry = data.get('org_industry', project.org_industry)
        project.org_website = data.get('org_website', project.org_website)
        project.org_address = data.get('org_address', project.org_address)
        project.contact_first_name = data.get('contact_first_name', project.contact_first_name)
        project.contact_last_name = data.get('contact_last_name', project.contact_last_name)
        project.contact_position_title = data.get('contact_position_title', project.contact_position_title)
        project.contact_phone = data.get('contact_phone', project.contact_phone)
        project.contact_email = data.get('contact_email', project.contact_email)
        project.org_document = data.get('org_document', project.org_document)
        project.project_document = data.get('project_document', project.project_document)
        project.agreement_document = data.get('agreement_document', project.agreement_document)
        project.project_name = data.get('project_name', project.project_name)
        project.project_description = data.get('project_description', project.project_description)
        project.project_criteria = data.get('project_criteria', project.project_criteria)
        project.project_skillset = data.get('project_skillset', project.project_skillset)
        project.project_instructions = data.get('project_instructions', project.project_instructions)
        project.open_house = data.get('open_house', project.open_house)
        project.employment_history = data.get('employment_history', project.employment_history)
        project.employment_opportunities = data.get('employment_opportunities', project.employment_opportunities)
        project.employment_benefits = data.get('employment_benefits', project.employment_benefits)
        project.committed = data.get('committed', project.committed)
        project.other_projects = data.get('other_projects', project.other_projects)
        project.applied_students = data.get('applied_students', project.applied_students)
        project.approved_students = data.get('approved_students', project.approved_students)
        project.confirmed_students = data.get('confirmed_students', project.confirmed_students)

        session.commit()

        return jsonify({"message": "Project updated successfully!"}), 200

    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400

    finally:
        session.close()
'''
@app.route('/approvals', methods=['GET'])
def get_all_approvals():
    session = Session()
    try:
        approvals = session.query(Approval).all()
        approval_data = [{
            "id": approval.id,
            "project_id": approval.project_id,
            "user_id": approval.user_id,
            "submitter_id": approval.submitter_id
        } for approval in approvals]

        return jsonify(approval_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()
'''

@app.route('/approvals', methods=['GET'])
def get_all_approvals():
    session = Session()
    try:
        approvals = session.query(Approval).all()

        approval_data = []
        for approval in approvals:
            # Fetch related user and project objects
            approved_student = session.query(User).filter_by(id=approval.user_id).first()
            submitter_user = session.query(User).filter_by(id=approval.submitter_id).first()
            project = session.query(Project).filter_by(id=approval.project_id).first()

            approval_data.append({
                "id": approval.id,
                "project_name": project.project_name if project else "(Project not found)",
                "approved_student_name": f"{approved_student.first_name} {approved_student.last_name}" if approved_student else "(Student not found)",
                "submitter_name": f"{submitter_user.first_name} {submitter_user.last_name}" if submitter_user else "(Approver not found)",
                "created_at": approval.created_at.strftime("%Y-%m-%d %H:%M") if approval.created_at else ""
            })

        return jsonify(approval_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        session.close()


@app.route('/approvals', methods=['POST'])
def create_approval():
    data = request.get_json()
    session = Session()
    try:
        project_id = data.get("project_id")
        user_id = data.get("user_id")
        submitter_id = data.get("submitter_id")

        if not all([project_id, user_id, submitter_id]):
            return jsonify({"error": "Missing project_id, user_id, or submitter_id"}), 400

        new_approval = Approval(
            project_id=project_id,
            user_id=user_id,
            submitter_id=submitter_id
        )
        session.add(new_approval)
        session.commit()

        return jsonify({"message": "Approval recorded successfully!"}), 201

    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400

    finally:
        session.close()

@app.route('/delete-all-approvals', methods=['DELETE'])
def delete_all_approvals():
    session = Session()
    try:
        session.query(Approval).delete()
        session.commit()
        return jsonify({"message": "All approvals deleted successfully!"}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        session.close()



""" @app.route('/delete-all-users', methods=['DELETE'])
def delete_all_users():
    session = Session()

    try:
        session.query(User).delete()
        session.commit()
        return jsonify({"message": "All users deleted successfully!"}), 200

    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400

    finally:
        session.close() """


if __name__ == '__main__':
    print(app.url_map)
    app.run(debug=True)
