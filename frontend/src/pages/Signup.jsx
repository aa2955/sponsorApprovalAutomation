import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "./Navbar";
import "../styles/Signup.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    ucid: "",
    email: "",
    phone: "",
    password: "",
    roles: "",
    confirm_password: "",
    major: "",
    minor: "",
    specialization: "",
    org_name: "",
    position_title: "",
    org_category: "",
    org_industry: "",
    org_website: "",
    org_address: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'rolesAdmin' && e.target.value !== "" && formData.roles !== "")
      setFormData({ ...formData, "roles": `${formData.roles},${e.target.value}` });
    else if (e.target.name === 'rolesAdmin' && e.target.value === "" && formData.roles !== "")
      setFormData({ ...formData, "roles": `${formData.roles.split(",")[0]}` });
    else
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    const endpoint = "/register";

    try {
      await api.post(endpoint, { ...formData });
      setSuccess("Registration successful! Redirecting to login...");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setSuccess("");
    }
  };

  return (
    <>
      <Navbar currentPage="signup" />

      <div className="signup page">
        <h2>Sign Up</h2>

        {!formData.roles ? (
          <div className="role-select-container">
            <h4>Please select your role to begin:</h4>
            <div className="role-buttons">
              <button name="roles" value="student" onClick={handleChange}>🎓 I'm a Student</button>
              <button name="roles" value="sponsor" onClick={handleChange}>🏢 I'm a Sponsor</button>
            </div>
          </div>
        ) : (
          <>
            <form className="form" onSubmit={handleSubmit}>
              <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
              <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
              <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
              <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              <input name="confirm_password" type="password" placeholder="Confirm Password" value={formData.confirm_password} onChange={handleChange} required />

              {formData.roles.includes("student") && (
                <>
                  <h3>Student Specific Information:</h3>
                  <input name="ucid" placeholder="UCID" value={formData.ucid} onChange={handleChange} required />
                  <input name="major" placeholder="Major" value={formData.major} onChange={handleChange} />
                  <input name="minor" placeholder="Minor" value={formData.minor} onChange={handleChange} />
                  <input name="specialization" placeholder="Specialization" value={formData.specialization} onChange={handleChange} />
                </>
              )}

              {formData.roles.includes("sponsor") && (
                <>
                  <h3>Sponsor Specific Information:</h3>
                  <input name="position_title" placeholder="Position Title" value={formData.position_title} onChange={handleChange} required />
                  <input name="org_name" placeholder="Organization Name" value={formData.org_name} onChange={handleChange} required />
                  <select name="org_category" value={formData.org_category} onChange={handleChange} required>
                    <option style={{ display: "none" }} defaultValue>-- Which best describes your organization or affiliation? --</option>
                    <option value="Public Service">Public Service</option>
                    <option value="EDC Company">EDC Company</option>
                    <option value="Small Business">Small Business</option>
                    <option value="Medium Size Business">Medium Size Business</option>
                    <option value="Large Business">Large Business</option>
                    <option value="Fortune 500 Company">Fortune 500 Company</option>
                    <option value="Fortune 1000 Company">Fortune 1000 Company</option>
                    <option value="Student Entrepreneur">Student Entrepreneur</option>
                    <option value="External Entrepreneur">External Entrepreneur</option>
                    <option value="NJIT Faculty">NJIT Faculty</option>
                    <option value="NJIT Department">NJIT Department</option>
                    <option value="Other University">Other University</option>
                    <option value="Other Non-Profit Organization">Other Non-Profit Organization</option>
                  </select>
                  <select name="org_industry" value={formData.org_industry} onChange={handleChange} required>
                    <option style={{ display: "none" }} defaultValue>-- Which best describes your industry? --</option>
                    <option value="Manufacturing/R">Manufacturing/R</option>
                    <option value="Non-Profit/Charity">Non-Profit/Charity</option>
                    <option value="Web/IT Professional Services">Web/IT Professional Services</option>
                    <option value="Education">Education</option>
                    <option value="Advertising/Marketing/PR">Advertising/Marketing/PR</option>
                    <option value="Government/Military/Aerospace">Government/Military/Aerospace</option>
                    <option value="Finance/Insurance/Real Estate">Finance/Insurance/Real Estate</option>
                    <option value="Travel/Transportation/Hospitality">Travel/Transportation/Hospitality</option>
                    <option value="Media/Entertainment/Arts">Media/Entertainment/Arts</option>
                    <option value="Workforce Development/Professional Training">Workforce Development/Professional Training</option>
                    <option value="Retail/Wholesale/Trade">Retail/Wholesale/Trade</option>
                    <option value="Healthcare/Pharmaceutical/Biotech">Healthcare/Pharmaceutical/Biotech</option>
                  </select>
                  <input name="org_website" placeholder="Website URL" value={formData.org_website} onChange={handleChange} />
                  <input name="org_address" placeholder="Address" value={formData.org_address} onChange={handleChange} required />
                </>
              )}

                <label className="label">Set Admin:</label>
                <select name="rolesAdmin" onChange={handleChange}>
                  <option value="">No</option>   
                  <option value="admin">Yes</option>
                </select>

              <div className="buttonArea">
                <button type="submit">Register</button>
                <button type="button" name="roles" value="" onClick={handleChange} className="secondary">Back to Role Select</button>
              </div>

              {success && <p style={{ color: "green" }}>{success}</p>}
              {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
          </>
        )}

        <br />
        <span className="suggestion">Have an account already? <Link to="/login">Log In Here</Link></span>
      </div>
    </>
  );
}
