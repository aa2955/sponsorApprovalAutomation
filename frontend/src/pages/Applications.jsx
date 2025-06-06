import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "../styles/Application.css";

export default function Applications() {
  const userLocal = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const userRole = userLocal && 'roles' in userLocal ? userLocal.roles : null;

  return (
    <>
      <Navbar currentPage="applications" />

      <div className="applications page">
        <h1>Apply for Capstone</h1>
        <h4>Please select one of the following available application options:</h4>

        <div className="app-links">
          { userLocal && userRole && (userRole.includes('sponsor') || userRole.includes('admin')) ?
          <Link to="/applications/proposal" className="app-button">
            📄 Sponsor Proposal Application
          </Link> : <></> }

          { userLocal && userRole && (userRole.includes('sponsor') || userRole.includes('admin')) ?
          <Link to="/applications/approval" className="app-button">
            ✅ Sponsor Approval Form
          </Link> : <></> }
        </div>

      </div>
    </>
  );
}
