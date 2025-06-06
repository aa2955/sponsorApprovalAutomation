import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "react-data-grid";
import Navbar from "./Navbar";
import api from "../services/api";
import "../styles/Directory.css";
import "react-data-grid/lib/styles.css";
import { FaEye } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Directory() {
  const navigate = useNavigate();
  const userLocal = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = userLocal.roles || "";

  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentSemester, setCurrentSemester] = useState("summer");
  const [currentYear, setCurrentYear] = useState(2025);

  useEffect(() => {
    setLoading(true);
    setError("");
    let endpoint = "/projects";
    if (activeTab === "students" || activeTab === "sponsors") endpoint = "/users";
    if (activeTab === "approvals") endpoint = "/approvals";

    api.get(endpoint)
      .then(res => {
        if (activeTab === "projects" || activeTab === "allProjects") {
          setProjects(res.data);
        } else if (activeTab === "students" || activeTab === "sponsors") {
          setUsers(res.data);
        } else if (activeTab === "approvals") {
          setApprovals(res.data);
        }
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const handleSemesterChange = (e) => {
    const value = e.target.value;
    setCurrentSemester(value);
    localStorage.setItem("currentSemester", value);
    toast.success(`Semester changed to ${value}`);
  };

  const handleYearChange = (e) => {
    const value = parseInt(e.target.value);
    setCurrentYear(value);
    localStorage.setItem("currentYear", value.toString());
    toast.success(`Year changed to ${value}`);
  };

  const projectColumns = [
    { key: "view", name: "Info", width: "min-content", renderCell: ({ row }) => (<FaEye onClick={(e) => { e.stopPropagation(); navigate(`/project/${row.id}`); }} className="eye" />) },
    { key: "project_name", name: "Project Name" },
    { key: "org_name", name: "Organization Name" },
    { key: "contact_name", name: "Contact Name", renderCell: ({ row }) => (`${row.contact_first_name} ${row.contact_last_name}`) },
    { key: "contact_email", name: "Contact Email" },
    { key: "contact_phone", name: "Contact Phone" }
  ];

  const allProjectColumns = [
    { key: "view", name: "Info", width: "min-content", renderCell: ({ row }) => (<FaEye onClick={(e) => { e.stopPropagation(); navigate(`/project/${row.id}`); }} className="eye" />) },
    { key: "project_name", name: "Project Name" },
    { key: "org_name", name: "Organization Name" },
    { key: "semester", name: "Semester" },
    { key: "year", name: "Year" },
    { key: "approved", name: "Approved?", renderCell: ({ row }) => (row.approved == 1 ? "Yes" : "No") }
  ];

  const studentColumns = [
    { key: "view", name: "Info", width: "min-content", renderCell: ({ row }) => (<FaEye onClick={(e) => { e.stopPropagation(); navigate(`/user/${row.id}`); }} className="eye" />) },
    { key: "name", name: "Name", renderCell: ({ row }) => (`${row.first_name} ${row.last_name}`) },
    { key: "email", name: "Email" },
    { key: "phone", name: "Phone" },
    { key: "ucid", name: "UCID" },
    { key: "major", name: "Major" },
    { key: "minor", name: "Minor" },
    { key: "specialization", name: "Specialization" }
  ];

  const sponsorColumns = [
    { key: "view", name: "Info", width: "min-content", renderCell: ({ row }) => (<FaEye onClick={(e) => { e.stopPropagation(); navigate(`/user/${row.id}`); }} className="eye" />) },
    { key: "name", name: "Name", renderCell: ({ row }) => (`${row.first_name} ${row.last_name}`) },
    { key: "email", name: "Email" },
    { key: "phone", name: "Phone" },
    { key: "position_title", name: "Position Title" },
    { key: "org_name", name: "Organization Name" },
    { key: "org_category", name: "Organization Size" },
    { key: "org_industry", name: "Organization Industry" },
    { key: "org_website", name: "Organization Website" },
    { key: "org_address", name: "Organization Address" }
  ];

  const approvalColumns = [
    { key: "id", name: "Approval ID" },
    { key: "approved_student_name", name: "Approved Student" },
    { key: "project_name", name: "Project Name" },
    { key: "submitter_name", name: "Approved By" },
    { key: "created_at", name: "Time Approved"}
  ];

  const filteredUsers = (role) => users.filter(user => user.roles.includes(role));

  return (
    <>
      <Navbar currentPage="directory" />
      <div className="directory page">
        
        {userRole.includes("admin") && activeTab === "projects" && (
          <div className="semesterYearFilter">
            <label>Semester:</label>
            <select value={currentSemester} onChange={handleSemesterChange}>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
            </select>

            <label>Year:</label>
            <select value={currentYear} onChange={handleYearChange}>
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>
        )}

        <div className="tabs">
          <button className={activeTab === "projects" ? "active" : ""} onClick={() => setActiveTab("projects")}>Projects</button>
          <button className={activeTab === "students" ? "active" : ""} onClick={() => setActiveTab("students")}>Students</button>
          <button className={activeTab === "sponsors" ? "active" : ""} onClick={() => setActiveTab("sponsors")}>Sponsors</button>
          {userRole.includes("admin") && (
            <>
              <button className={activeTab === "allProjects" ? "active" : ""} onClick={() => setActiveTab("allProjects")}>All Projects</button>
              <button className={activeTab === "approvals" ? "active" : ""} onClick={() => setActiveTab("approvals")}>Approvals</button>
            </>
          )}
        </div>

        <div className="tab-bottom"></div>

        {loading && <div className="loadingSpinner"></div>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="datagridContainer">
          {!loading && !error && (
            <DataGrid
              columns={
                activeTab === "projects" ? projectColumns :
                activeTab === "students" ? studentColumns :
                activeTab === "sponsors" ? sponsorColumns :
                activeTab === "allProjects" ? allProjectColumns :
                approvalColumns
              }
              rows={
                activeTab === "projects" ?
                  projects.filter(p =>
                    p.approved == 1 &&
                    (userRole.includes("admin")
                      ? (p.semester?.toLowerCase() === currentSemester.toLowerCase() && p.year == currentYear)
                      : true) // <-- non-admins see all approved projects regardless of semester
                  ) :
                activeTab === "allProjects" ? projects :
                activeTab === "students" ? filteredUsers("student") :
                activeTab === "sponsors" ? filteredUsers("sponsor") :
                approvals
              }
              className="rdg-light"
              rowHeight={50}
            />
          )}
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}
