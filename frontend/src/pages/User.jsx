import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // ⬅️ ADD useLocation
import { FaEye } from "react-icons/fa";

import Navbar from "./Navbar";
import api from "../services/api";

import "../styles/User.css";

export default function User() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // ⬅️ ADD THIS

  const [user, setUser] = useState(null);
  const [projectInfo, setProjectInfo] = useState([]);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0); // ⬅️ ADD refreshKey

  const userLocal = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const userId = userLocal?.id || null;
  const userRole = userLocal?.roles || null;

  useEffect(() => {
    api.get(`/user/${id}`)
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        console.error("Error fetching user:", err);
      });
  }, [id, refreshKey]); // ⬅️ DEPEND ON refreshKey

  useEffect(() => {
    if (!user) return;
    api.get("/projects")
      .then(res => {
        let appliedProjects = [];
        let approvedProjects = [];
        let committedProject = [];

        if (user.applied_projects)
          user.applied_projects.replace(/\[|\]| /g, '')
            .split(',').filter(Boolean).map(Number)
            .forEach(pid => {
              const match = res.data.find(p => p.id === pid);
              appliedProjects.push(match);
            });

        if (user.approved_projects)
          user.approved_projects.replace(/\[|\]| /g, '')
            .split(',').filter(Boolean).map(Number)
            .forEach(pid => {
              const match = res.data.find(p => p.id === pid);
              approvedProjects.push(match);
            });

        if (user.committed_project)
          user.committed_project.replace(/\[|\]| /g, '')
            .split(',').filter(Boolean).map(Number)
            .forEach(pid => {
              const match = res.data.find(p => p.id === pid);
              committedProject.push(match);
            });

        setProjectInfo([appliedProjects, approvedProjects, committedProject]);
      }).catch(err => setError(`Error loading student projects data: ${err}`));
  }, [user]);

  useEffect(() => {
    if (location.state?.refresh) {
      setRefreshKey(prev => prev + 1);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  if (!user) return <div className="loadingSpinner"></div>;

  const handleDelete = async () => {
    try {
      await api.delete(`/user/${user.id}`);
      navigate(`/directory`);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleEdit = () => {
    navigate(`/edit-user/${user.id}`);
  };

  const projectList = (projects) => {
    if (!Array.isArray(projects)) return null;
    return projects.map((project, i) => (
      !project ? <li key={`missing-${i}`}>(Project not found)</li> : (
        <li key={project.id}>
          <FaEye onClick={() => navigate(`/project/${project.id}`)} className="eye" /> {project.project_name}
        </li>
      )
    ));
  };

  const displayField = (label, value) => (
    <tr>
      <th>{label}</th>
      <td>
        {value ? value : <span className="notProvided" title="No information available">(Not provided)</span>}
      </td>
    </tr>
  );

  return (
    <>
      <Navbar />
      <div className='user page'>
        <h1>
          <span className='header'>{user.first_name} {user.last_name}</span>
          {user.roles.split(',').map(role => (
            <span className='role' key={role}>{role.toUpperCase()}</span>
          ))}
        </h1>

        <table><tbody>
          {displayField("Email", user.email)}
          {displayField("Phone", user.phone)}
        </tbody></table>

        {user.roles.includes('sponsor') && (
          <>
            <h2>Company/Organization Information:</h2>
            <table><tbody>
              {displayField("Name", user.org_name)}
              {displayField("Scope", user.org_category)}
              {displayField("Industry", user.org_industry)}
              <tr>
                <th>Website</th>
                <td>
                  {user.org_website ? (
                    <a
                      href={
                        user.org_website.startsWith("http://") || user.org_website.startsWith("https://")
                          ? user.org_website
                          : `https://${user.org_website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {user.org_website}
                    </a>
                  ) : (
                    <span className="notProvided" title="No website provided">(Not provided)</span>
                  )}
                </td>
              </tr>
              {displayField("Address", user.org_address)}
            </tbody></table>
          </>
        )}

        {user.roles.includes('student') && (
          <>
            <h2>Student Information:</h2>
            <table><tbody>
              {displayField("Major", user.major)}
              {displayField("Minor", user.minor)}
              {displayField("Specialization", user.specialization)}
              {displayField("UCID", user.ucid)}
            </tbody></table>

            <h2>Project Application Information:</h2>
            <table><tbody>
              <tr>
                <th>Projects Applied To:</th>
                <td><ul>{projectInfo[0] ? projectList(projectInfo[0]) : <li>Loading...</li>}</ul></td>
              </tr>
              <tr>
                <th>Projects Approved For:</th>
                <td><ul>{projectInfo[1] ? projectList(projectInfo[1]) : <li>Loading...</li>}</ul></td>
              </tr>
              <tr>
                <th>Project Committed To:</th>
                <td><ul>{projectInfo[2] ? projectList(projectInfo[2]) : <li>Loading...</li>}</ul></td>
              </tr>
            </tbody></table>
          </>
        )}

        <div className="buttonArea">
          {userLocal && userRole && userId && (userRole.includes('admin') || user.id === userId) && (
            <>
              <button type="button" onClick={handleEdit}>Edit User</button>
              {userRole.includes('admin') && (
                <button type="button" onClick={handleDelete}>Delete User</button>
              )}
            </>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

      </div>
    </>
  );
}
