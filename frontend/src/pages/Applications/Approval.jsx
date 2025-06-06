import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import api from "../../services/api";
import "../../styles/Form.css";

export default function Approval() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || (!user.roles.includes('sponsor') && !user.roles.includes('admin'))) {
      navigate('/');
    }
  }, [user, navigate]);

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [availableStudents, setAvailableStudents] = useState([]);

  const [formData, setFormData] = useState({
    user_email: "",
    sponsor_org: "",
    project_id: "",
    submitter_name: `${user?.first_name || ""} ${user?.last_name || ""}`,
    submitter_email: user?.email || "",
  });

  const fetchAllData = async () => {
    try {
      const [projectRes, userRes] = await Promise.all([
        api.get("/projects"),
        api.get("/users")
      ]);
      setProjects(projectRes.data);
      setUsers(userRes.data);

      const selectedProject = projectRes.data.find(p => p.id === Number(formData.project_id));
      if (selectedProject) {
        const appliedIds = JSON.parse(selectedProject.applied_students || "[]");
        const matchingStudents = userRes.data.filter(u => appliedIds.includes(u.id));
        setAvailableStudents(matchingStudents);
      }
    } catch (err) {
      console.error("Failed to fetch initial data:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "sponsor_org") {
      setSelectedOrg(value);
      setFormData(prev => ({ ...prev, sponsor_org: value, project_id: "", user_email: "" }));
      setAvailableStudents([]);
    } else if (name === "project_id") {
      setFormData(prev => ({ ...prev, project_id: value, user_email: "" }));
      const selectedProject = projects.find(p => p.id === Number(value));
      const appliedIds = JSON.parse(selectedProject?.applied_students || "[]");
      const matchingStudents = users.filter(u => appliedIds.includes(u.id));
      setAvailableStudents(matchingStudents);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const allOrgs = [...new Set(projects.map(p => p.org_name).filter(Boolean))];
  const projectsForOrg = projects.filter(p => p.org_name === selectedOrg);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const student = users.find(u => u.email === formData.user_email);
    const project = projects.find(p => p.id === Number(formData.project_id));

    if (!student || !project) {
      alert("❌ Could not find the selected student or project.");
      return;
    }

    try {
      const res = await api.patch(`/approve/${project.id}/${student.id}`, {
        submitter_id: user.id   // <-- add the approving user's id
      }, {
        headers: { "Content-Type": "application/json" }
      });        
      alert("✅ " + res.data.message);
      await fetchAllData(); // Refresh data to update dropdown
    } catch (err) {
      console.error("Error approving student:", err);
      alert("❌ Failed to approve student: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <>
      <Navbar currentPage="applications" />
      <div className="proposal page">
        <h1>Capstone Sponsor Approval Form</h1>

        <form className="proposal form" onSubmit={handleSubmit}>
          {/* Sponsor Org Dropdown */}
          <label className="label">Sponsor Organization *</label>
          <select name="sponsor_org" onChange={handleChange} value={formData.sponsor_org} required>
            <option value="">-- Select Sponsor Org --</option>
            {allOrgs.map(org => (
              <option key={org} value={org}>{org}</option>
            ))}
          </select>

          {/* Project Dropdown */}
          <label className="label">Project Title *</label>
          <select
            name="project_id"
            onChange={handleChange}
            value={formData.project_id}
            required
            disabled={!selectedOrg}
          >
            <option value="">-- Select Project --</option>
            {projectsForOrg.map(p => (
              <option key={p.id} value={p.id}>{p.project_name}</option>
            ))}
          </select>

          {/* Student Dropdown */}
          <label className="label">Student to Approve *</label>
          <select
            name="user_email"
            onChange={handleChange}
            value={formData.user_email}
            required
            disabled={availableStudents.length === 0}
          >
            <option value="">-- Select Student --</option>
            {availableStudents.map(s => (
              <option key={s.email} value={s.email}>
                {s.first_name} {s.last_name} ({s.email})
              </option>
            ))}
          </select>

          <hr />
          <h2>Submitter Information</h2>

          <label className="label">Your Name</label>
          <input type="text" name="submitter_name" value={formData.submitter_name} readOnly />

          <label className="label">Your Email</label>
          <input type="email" name="submitter_email" value={formData.submitter_email} readOnly />

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
