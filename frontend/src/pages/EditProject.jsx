import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "./Navbar";
import "../styles/Form.css";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const userLocal = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = userLocal.roles || "";
  const userEmail = userLocal.email || "";

  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await api.get(`/project/${id}`);
        setFormData({
          ...res.data,
          approved: Number(res.data.approved)
        });

        if (!userRole.includes("admin") && res.data.contact_email !== userEmail) {
          alert("Unauthorized access.");
          navigate("/directory");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project details.");
      }
    }
    fetchProject();
  }, [id, navigate, userRole, userEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "approved" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/project/${id}`, formData);
      setSuccess("Project updated successfully! Redirecting...");
      setError("");
      setTimeout(() => navigate(`/project/${id}`), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong");
      setSuccess("");
    }
  };

  if (!formData) return <div className="loadingSpinner"></div>;

  return (
    <>
      <Navbar currentPage="directory" />
      <div className="proposal page">
        <h1>Edit Project</h1>

        <form className="proposal form" onSubmit={handleSubmit}>
          <h2>Time Frame</h2>
          <label className="label">Semester *</label>
          <select name="semester" onChange={handleChange} value={formData.semester} required>
            <option value="">-- select --</option>
            <option value="fall">Fall</option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="winter+spring">Winter + Spring</option>
          </select>

          <label className="label">Year *</label>
          <input type="number" name="year" value={formData.year} onChange={handleChange} required />

          <h2>Company Information</h2>
          <label className="label">Company/Organization Name *</label>
          <input name="org_name" value={formData.org_name} onChange={handleChange} required />

          <label className="label">Organization Category *</label>
          <input name="org_category" value={formData.org_category} onChange={handleChange} required />

          <label className="label">Industry *</label>
          <input name="org_industry" value={formData.org_industry} onChange={handleChange} required />

          <label className="label">Website URL</label>
          <input name="org_website" value={formData.org_website} onChange={handleChange} />

          <label className="label">Full Address *</label>
          <input name="org_address" value={formData.org_address} onChange={handleChange} required />

          <h2>Contact Information</h2>
          <label className="label">Contact First Name *</label>
          <input name="contact_first_name" value={formData.contact_first_name} onChange={handleChange} required />

          <label className="label">Contact Last Name *</label>
          <input name="contact_last_name" value={formData.contact_last_name} onChange={handleChange} required />

          <label className="label">Position Title *</label>
          <input name="contact_position_title" value={formData.contact_position_title} onChange={handleChange} required />

          <label className="label">Phone *</label>
          <input name="contact_phone" value={formData.contact_phone} onChange={handleChange} required />

          <label className="label">Email *</label>
          <input name="contact_email" value={formData.contact_email} onChange={handleChange} required />

          <h2>Project Proposal</h2>
          <label className="label">Project Title *</label>
          <input name="project_name" value={formData.project_name} onChange={handleChange} required />

          <label className="label">Project Description *</label>
          <textarea name="project_description" rows="4" value={formData.project_description} onChange={handleChange} required />

          <label className="label">Completion Criteria *</label>
          <textarea name="project_criteria" rows="4" value={formData.project_criteria} onChange={handleChange} required />

          <label className="label">Expected Skillset *</label>
          <textarea name="project_skillset" rows="4" value={formData.project_skillset} onChange={handleChange} required />

          <label className="label">Special Instructions</label>
          <textarea name="project_instructions" rows="4" value={formData.project_instructions} onChange={handleChange} />

          <label className="label">Additional Benefits</label>
          <textarea name="project_benefits" rows="4" value={formData.project_benefits} onChange={handleChange} />

          <h2>Other Information</h2>
          <label className="label">Other Projects?</label>
          <select name="other_projects" onChange={handleChange} value={formData.other_projects}>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <label className="label">Employment History</label>
          <textarea name="employment_history" rows="4" value={formData.employment_history} onChange={handleChange} />

          <label className="label">Employment Opportunities</label>
          <textarea name="employment_opportunities" rows="4" value={formData.employment_opportunities} onChange={handleChange} />

          <label className="label">Committed</label>
          <textarea name="committed" rows="4" value={formData.committed} onChange={handleChange} />

          {userRole.includes("admin") && (
            <>
              <h2>Project Approval (Admin Only)</h2>
              <label className="label">Approval Status *</label>
              <select name="approved" onChange={handleChange} value={String(formData.approved)}>
                <option value="1">Approved</option>
                <option value="0">Not Approved</option>
              </select>
            </>
          )}

          <div style={{ marginTop: "20px" }}>
            <button type="submit">Save Changes</button>
          </div>

          {success && <p style={{ color: "green" }}>{success}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </>
  );
}
