import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "./Navbar";
import "../styles/Form.css";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = currentUser.roles?.includes("admin");
  const currentUserId = currentUser.id;

  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get(`/user/${id}`);
        // Access control at page load
        if (!isAdmin && parseInt(id) !== currentUserId) {
          alert("Unauthorized access.");
          navigate("/directory");
          return;
        }
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user details.");
      }
    }
    fetchUser();
  }, [id, navigate, isAdmin, currentUserId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "roles") {
      let roleList = formData.roles.split(",").filter(Boolean);

      if (checked) {
        if (!roleList.includes(value)) roleList.push(value);

        // If adding a role, initialize extra fields
        if (value === "sponsor") {
          formData.org_name = formData.org_name || "";
          formData.org_category = formData.org_category || "";
          formData.org_industry = formData.org_industry || "";
          formData.org_website = formData.org_website || "";
          formData.org_address = formData.org_address || "";
          formData.position_title = formData.position_title || "";
        }
        if (value === "student") {
          formData.ucid = formData.ucid || "";
          formData.major = formData.major || "";
          formData.minor = formData.minor || "";
          formData.specialization = formData.specialization || "";
        }
      } else {
        roleList = roleList.filter(r => r !== value);
      }

      setFormData({ ...formData, roles: roleList.join(",") });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/user/${id}`, formData);
      setSuccess("User updated successfully! Redirecting...");
      setError("");
      setTimeout(() => navigate(`/user/${id}`, { state: { refresh: true } }), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong");
      setSuccess("");
    }
  };

  if (!formData) return <div className="loadingSpinner"></div>;

  const isStudent = formData.roles.includes("student");
  const isSponsor = formData.roles.includes("sponsor");

  return (
    <>
      <Navbar currentPage="directory" />
      <div className="proposal page">
        <h1>Edit User</h1>

        <form className="proposal form" onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }}>
          <h2>General Information</h2>

          <label className="label">First Name *</label>
          <input name="first_name" value={formData.first_name} onChange={handleChange} required />

          <label className="label">Last Name *</label>
          <input name="last_name" value={formData.last_name} onChange={handleChange} required />

          <label className="label">Email *</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />

          <label className="label">Phone *</label>
          <input name="phone" value={formData.phone} onChange={handleChange} required />

          {isAdmin && (
            <>
              <h2>Roles (Admin Only)</h2>
              <label>
                <input
                  type="checkbox"
                  name="roles"
                  value="student"
                  checked={formData.roles.includes("student")}
                  onChange={handleChange}
                /> Student
              </label>
              <label>
                <input
                  type="checkbox"
                  name="roles"
                  value="sponsor"
                  checked={formData.roles.includes("sponsor")}
                  onChange={handleChange}
                /> Sponsor
              </label>
              <label>
                <input
                  type="checkbox"
                  name="roles"
                  value="admin"
                  checked={formData.roles.includes("admin")}
                  onChange={handleChange}
                /> Admin
              </label>
            </>
          )}

          {isStudent && (
            <>
              <h2>Student Information</h2>
              <label className="label">UCID</label>
              <input name="ucid" value={formData.ucid || ""} onChange={handleChange} />

              <label className="label">Major</label>
              <input name="major" value={formData.major || ""} onChange={handleChange} />

              <label className="label">Minor</label>
              <input name="minor" value={formData.minor || ""} onChange={handleChange} />

              <label className="label">Specialization</label>
              <input name="specialization" value={formData.specialization || ""} onChange={handleChange} />
            </>
          )}

          {isSponsor && (
            <>
              <h2>Organization Information</h2>
              <label className="label">Organization Name</label>
              <input name="org_name" value={formData.org_name || ""} onChange={handleChange} />

              <label className="label">Organization Category</label>
              <input name="org_category" value={formData.org_category || ""} onChange={handleChange} />

              <label className="label">Organization Industry</label>
              <input name="org_industry" value={formData.org_industry || ""} onChange={handleChange} />

              <label className="label">Organization Website</label>
              <input name="org_website" value={formData.org_website || ""} onChange={handleChange} />

              <label className="label">Organization Address</label>
              <input name="org_address" value={formData.org_address || ""} onChange={handleChange} />

              <label className="label">Position Title</label>
              <input name="position_title" value={formData.position_title || ""} onChange={handleChange} />
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
