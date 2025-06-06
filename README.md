# Software Automation Team 2  
## Automating Capstone Sponsor Approvals

---

## 🧠 Background Information

### 📌 Project Requirements

- Implement an online application system for sponsor approvals.  
- Automatically verify student eligibility based on predefined rules.  
- Auto-route applications to sponsors for review and approval.  
- Track and audit the entire approval process with real-time updates.

### ✅ Explicit Sponsor Approval Rules

- Students must apply to at least one project at the sponsor table.  
- Their name must appear in the sponsor approval database.  
- Students must commit to only one approved project via the Discord commitment channel.  
- They must attend a round table meeting with their sponsor and team.  
- An official photo with the team and sponsor must be taken for documentation.

### 👨‍🏫 Co-Sponsors

- Dr. Osama Eljabiri  
- Benjamin Shuster

### 👥 Team Members

- **Sebastian Alcock** (Project Manager)  
- **Anurag Agarwal**  
- **Justin Nguyen**

### 👨‍💻 Team Composition

The ideal Capstone team to take over the remainder of this project would be:

- **Project Manager**  
  - Owns the roadmap, milestones, and day-to-day coordination.  
  - Works with stakeholders to refine requirements.  
  - Breaks down requirements into sprint tasks.  
  - Runs standups.

- **Backend Developer**  
  - Owns the Flask service and database.  
  - Writes and tests new endpoints.

- **Frontend Developer**  
  - Owns the React frontend.  
  - Handles styling and component design.

---

## 🧪 Installation

### 🔧 Prerequisites

- Python 3.0+  
- pip  
- [DB Browser for SQLite](https://sqlitebrowser.org/)  
- Git

### 📅 Cloning the Repository

```bash
git clone https://github.com/SebastianAlcock/sponsor-approvals-judging-process.git
pip install -r requirements.txt
```

### ⚙️ Install Dependencies

#### Backend:

```bash
cd backend
pip install -r requirements.txt
```

#### Frontend:

```bash
cd frontend
npm install
```

### ▶️ Run the Application

#### Backend:

```bash
cd backend
python -m flask run
```

#### Frontend:

```bash
cd frontend
npm start
```

---

## 🧠 Backend Overview

This documentation covers the **Flask-based backend API** for automating sponsor approvals and the judging process in the Capstone program.  
🔗 [Flask Documentation](https://flask.palletsprojects.com/en/stable/)

---

### 📃 View the Database

Two options:

- Open `capstone.db` in **DB Browser for SQLite** *(recommended)*.  
- Or use the terminal:
  ```bash
  sqlite3
  .open capstone.db
  .tables
  ```

---

### 🌐 Using the API Routes

You can use the following `curl` commands to interact with the API while the app is running.  
🔗 [Curl Documentation](https://docs.oracle.com/en/cloud/saas/marketing/eloqua-develop/Developers/GettingStarted/APIRequests/curl-requests.htm#GET)

---

### 📬 1. `POST /register-student` – Register a Student

**What it does:**  
Registers a new student.

**How it works:**

- Reads JSON payload.  
- Hashes the password.  
- Creates and commits a new `User`.  
- Returns 201 or 400.

```bash
curl -X POST http://127.0.0.1:5000/register-student \
-H "Content-Type: application/json" \
-d '{
    "first_name": "Allison",
    "last_name": "Smith",
    "ucid": "A12345",
    "email": "allison.smith@example.com",
    "phone": "987-654-3210",
    "password": "password456",
    "major": "Software Engineering",
    "minor": "Mathematics",
    "specialization": "Web Development"
}'
```

---

### 🧑‍💼 2. `POST /register-sponsor` – Register a Sponsor

```bash
curl -X POST http://127.0.0.1:5000/register-sponsor \
-H "Content-Type: application/json" \
-d '{
    "first_name": "Mike",
    "last_name": "Ema",
    "email": "mike.ema@google.com",
    "phone": "123-456-7890",
    "password": "password789",
    "position_title": "Project Manager",
    "org_name": "TechCorp",
    "org_category": "Technology",
    "org_industry": "Software",
    "org_website": "http://techcorp.com",
    "org_address": "123 Tech Park, Silicon Valley, CA"
}'
```

---

### 🔐 3. `POST /login` – Login a User

```bash
curl -X POST http://127.0.0.1:5000/login \
-H "Content-Type: application/json" \
-d '{
    "email": "mike.ema@google.com",
    "password": "password789"
}'
```

---

### 👥 4. `GET /users` – Get All Users

```bash
curl -X GET http://127.0.0.1:5000/users
```

---

### 📁 5. `GET /projects` – Get All Projects

```bash
curl -X GET http://127.0.0.1:5000/projects
```

---

### 👤 6. `GET /user/{email}` – Get User by Email

```bash
curl -X GET http://127.0.0.1:5000/user/alice.smith@example.com
```

---

### 📂 7. `GET /project/{id}` – Get Project by ID

```bash
curl -X GET http://127.0.0.1:5000/project/1
```

---

### ❌ 13. `DELETE /delete-all-approvals` – Clear All Approvals

```bash
curl -X DELETE http://127.0.0.1:5000/delete-all-approvals
```

---

### 📌 14. `PATCH /commit/{user_id}` – Student Commitment

```bash
curl -X PATCH http://127.0.0.1:5000/commit/1 \
-H "Content-Type: application/json" \
-d '{
    "project_name": "AI Research"
}'
```

---

## Frontend Documentation: Automation Dashboard for Capstone Sponsor Approvals

### Tools & Technologies Used

| Tool/Library | Purpose | Link |
|--------------|---------|------|
| [React.js](https://reactjs.org/) | Frontend library used for building the UI | https://reactjs.org/ |
| [React Router](https://reactrouter.com/en/main) | Enables navigation between views | https://reactrouter.com/ |
| [Axios](https://axios-http.com/docs/intro) | Handles API requests | https://axios-http.com/ |
| [React Data Grid](https://react-data-grid.github.io/) | Displays data tables | https://react-data-grid.github.io/ |
| [Framer Motion](https://www.framer.com/motion/) | Adds UI animations | https://www.framer.com/motion/ |
| [Toastify](https://fkhadra.github.io/react-toastify/introduction) | Notification popups | https://fkhadra.github.io/react-toastify/introduction |
| [VSCode](https://code.visualstudio.com/) | Recommended IDE | https://code.visualstudio.com/ |
| [Node.js](https://nodejs.org/en) | Needed to run the frontend | https://nodejs.org/en |
| [GitHub](https://github.com/) | Code hosting and collaboration | https://github.com/ |

---

### Project Structure

```
frontend/
│
├── src/
│   ├── pages/            # Main page components (Home, Login, Signup, etc.)
│   ├── services/         # Axios instance
│   ├── styles/           # All .css stylesheets
│   ├── App.js            # Main component with router config
│   └── index.js          # Root React entry
```

---

### Page-by-Page Functionality

#### 1. `Home.jsx`
- Displays a welcome message.
- Uses `localStorage` to greet the current user.
- Place to display important links or Capstone deadlines.

#### 2. `Login.jsx` & `Signup.jsx`
- Sends credentials to backend API.
- Stores user in `localStorage` upon success.
- Role-based form rendering (student vs. sponsor).

#### 3. `Directory.jsx`
- DataGrid-based dashboard.
- Tabs to view:
  - Active Projects
  - All Projects
  - Students
  - Sponsors
  - Approvals
- Eye icon navigates to detail pages.
- Admins can toggle semester and year filters.

#### 4. `Applications.jsx`
- Gateway for role-based application tools.
- Displays:
  - Sponsor Proposal Form
  - Sponsor Approval Form (filtered by organization)

#### 5. `Proposal.jsx`
- Collects full project and sponsor details.
- Sends data to `/createproject` backend route.
- Includes checkbox and file upload logic.

#### 6. `Approval.jsx`
- Allows sponsors/admins to approve student applications.
- Auto-fills fields based on logged-in user.
- Conditionally renders dropdowns based on sponsor org and project.

#### 7. `Project.jsx`
- Detailed view of a single project.
- Includes: description, criteria, skillsets, contact info, and student applicants.
- Buttons:
  - Students can Apply / Commit
  - Admins can Edit / Delete

#### 8. `User.jsx`
- Displays user profile (student/sponsor)
- Includes tables for applied, approved, and committed projects.
- Admins and users themselves can edit or delete profile.

#### 9. `EditUser.jsx` & `EditProject.jsx`
- Dynamic forms that load current data.
- Role-based access control logic in place.
- Save changes via PATCH request.

#### 10. `Navbar.jsx`
- Top bar used across all pages.
- Updates active tab via `currentPage` prop.
- Logout functionality clears `localStorage` and redirects.

---

### Styling (CSS Folder)
- `styles/Directory.css`: Used for directory layout and table overrides.
- `styles/Form.css`: Shared by all forms (Signup, Proposal, Approval).
- `styles/Navbar.css`, `Login.css`, `Signup.css`, etc. for page-specific designs.

---

### Known Issues & Limitations

- **No Role Protection on Signup**: Users can choose whatever role they want to and also pick admin status for themselves.
- **Not Mobile Optimized**: DataGrid and form layouts break on small screens.
- **No JWT Authentication**: Current auth system stores user data in `localStorage` only, not secure.

---

### Design Decisions

- **Single Site > Discord/Formsite**: Moving all workflows to one site ensures:
  - Real-time approval updates
  - Cleaner audit trail (e.g., `approvals` table)
  - Easier onboarding for sponsors
- **Role-Based Access Control**: Logic in each page ensures only the appropriate user can view/edit content.
- **Separation of Concerns**: React handles rendering + routing; Flask handles logic + data.
- **One Project Commitment**: Prevents accidental overcommitment from students.
- **Framer Motion Animations**: Adds polish to transitions (e.g., welcome message).

---

### Unfulfilled Requirements

| Feature | Reason Not Completed |
|--------|----------------------|
| Track Selection Forms | Needed new route/model + UI |
| Judge Dashboard | Out of scope for MVP |
| Sponsor Account Verification | No email service or code verification yet |
| Student Resume Uploads | File upload logic not complete |
| Admin Bulk Imports | Would require CSV parsing + database merge logic |

---

### Future Stretch Goals

- **Full Admin Dashboard**: Drag-and-drop assignments, export tools, search filters.
- **JWT Auth + Refresh Tokens**: Replace `localStorage` with secure cookie-based auth.
- **Judging Rubric Module**: Admins create rubrics, judges score directly on the platform.
- **Sponsor Analytics Dashboard**: Track engagement across semesters.
- **Automated Resume Parsing**: Integrate tools to parse resumes
- **Document Upload + Preview**: Allow uploaded PDFs to preview within the browser.

---

### Resources

- **GitHub Repo**: https://github.com/SebastianAlcock/sponsor-approvals-judging-process
- **SQLite**: https://www.sqlite.org/docs.html
- **VSCode**: https://code.visualstudio.com/
- **DB Browser for SQLite**: https://sqlitebrowser.org/
- **React Docs**: https://reactjs.org/docs/getting-started.html
- **Axios Docs**: https://axios-http.com/docs/intro
- **Framer Motion**: https://www.framer.com/motion/
- **Toastify**: https://fkhadra.github.io/react-toastify/introduction/