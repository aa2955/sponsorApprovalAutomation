import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";

import "../styles/Project.css";

import api from "../services/api";

import Navbar from "./Navbar";

export default function Project() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [user, setUser] = useState(null);

  const [studentInfo, setStudentInfo] = useState([[],[],[]]);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const userLocal = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  const userId = userLocal && 'id' in userLocal ? userLocal.id : null;

  const userRole = userLocal && 'roles' in userLocal ? userLocal.roles : null;

  useEffect(() => {
    api.get(`/project/${id}`).then(res => {
      setProject(res.data);
      //console.log(res.data)
    }).catch(err => {
      console.error("Error fetching project:", err);
    });
  }, [id]);

  useEffect(() => {
    if (userId)
    api.get(`/user/${userId}`).then(res => {
      setUser(res.data);
      //console.log(res.data)
    }).catch(err => {
      console.error("Error fetching user:", err);
    });
  }, [userId]);

  useEffect(() => {
    api.get("/users")
      .then(res => {
        if (project) {
          var appliedStudents = [];
          var approvedStudents = [];
          var confirmedStudents = [];

          project.applied_students.replace(/\[|\]| /g,'').split(',').forEach(id => {
            var students = res.data.filter(function(user){return `${user.id}` === id})[0];
            appliedStudents = [...appliedStudents, students];
          })
          project.approved_students.replace(/\[|\]| /g,'').split(',').forEach(id => {
            var students = res.data.filter(function(user){return `${user.id}` === id})[0];
            approvedStudents = [...approvedStudents, students];
          })
          project.confirmed_students.replace(/\[|\]| /g,'').split(',').forEach(id => {
            var students = res.data.filter(function(user){return `${user.id}` === id})[0];
            confirmedStudents = [...confirmedStudents, students];
          })
          
          setStudentInfo([appliedStudents, approvedStudents, confirmedStudents]);
        }
      }).catch(err => {setError(`Error loading student applicant data: ${err}`)});
  }, [project]);

  const handleApply = async (e) => {
    const endpoint = `/apply/${userId}`;
    try {
      await api.patch(endpoint,project);
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleCommit = async (e) => {
    const endpoint = `/commit/${userId}`;
    try {
      await api.patch(endpoint,project);
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  if (!project) return <div className="loadingSpinner"></div>;

  const handleDelete = async (e) => {
    const endpoint = `/project/${project.id}`;
    try {
      await api.delete(endpoint);
      navigate(`/directory`);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  // TODO: IMPLEMENT PROJECT EDITING
  const handleEdit = async (e) => {
    navigate(`/edit-project/${project.id}`);
  };

  function studentList(studentArray) {
    if (studentArray)
      return studentArray.map(student => {
        if (student) 
          return <li key={student.id}>
                    <FaEye
                      onClick={(e) => {
                        navigate(`/user/${student.id}`);
                      }}
                      className="eye"
                    /> {student.first_name} {student.last_name} ({student.ucid}) 
                  </li>; 
        else return <li key={project.id}></li>
      })
  }

  return (
    <>
      <Navbar />
      <div className='project page'>
        <h1>
          {project.project_name}
        </h1>
        <table><tbody>
          
          <tr>
            <th>
              Description
            </th>
            <td>
              <span className='long'>
                {project.project_description.split(/\r\n|\r|\n/).map(p => {return <div key={p}>{p}</div>})}
              </span>
            </td>
          </tr>
          
          <tr>
            <th>
              Project Completion Criteria
            </th>
            <td>
              <span className='long'>
                {project.project_criteria.split(/\r\n|\r|\n/).map(p => {return <div key={p}>{p}</div>})}
              </span>
            </td>
          </tr>
          
          <tr>
            <th>
              Expected Skillset / Background
            </th>
            <td>
              <span className='long'>
                {project.project_skillset.split(/\r\n|\r|\n/).map(p => {return <div key={p}>{p}</div>})}
              </span>
            </td>
          </tr>
          
          <tr>
            <th>
              Special Instructions or Concerns
            </th>
            <td>
              <span className='long'>
                {project.project_instructions.split(/\r\n|\r|\n/).map(p => {return <div key={p}>{p}</div>})}
              </span>
            </td>
          </tr>
        
        </tbody></table>

        <h2>
          Company Information:
        </h2>

        <table><tbody>

          <tr>
            <th>
              Name
            </th>
            <td>
              {project.org_name}
            </td>
          </tr>

          <tr>
            <th>
              Scope and Industry
            </th>
            <td>
              {project.org_category}, {project.org_industry}
            </td>
          </tr>
          
          <tr>
            <th>
              Website
            </th>
            <td>
              <a href={project.org_website}>{project.org_website}</a>
            </td>
          </tr>
          
          <tr>
            <th>
              Address
            </th>
            <td>
              {project.org_address}
            </td>
          </tr>
        
        </tbody></table>

        <h2>
          Contact Information:
        </h2>
        
        <table><tbody>

          <tr>
            <th>
              Name
            </th>
            <td>
              {project.contact_first_name} {project.contact_last_name}
            </td>
          </tr>
          
          <tr>
            <th>
              Position
            </th>
            <td>
              {project.contact_position_title}
            </td>
          </tr>
          
          <tr>
            <th>
              Email
            </th>
            <td>
              {project.contact_email}
            </td>
          </tr>
          
          <tr>
            <th>
              Phone
            </th>
            <td>
              {project.contact_phone}
            </td>
          </tr>
        
        </tbody></table>

        <h2>
          Student Application Information:
        </h2>
        
        <table><tbody>
          
          <tr>
            <th>
              Applied Students:
            </th>
            <td>
              <ul>
                {studentInfo[0] ? studentList(studentInfo[0]) : <li key='x'>Loading...</li>}
              </ul>
            </td>
          </tr>
          
          <tr>
            <th>
              Approved Students:
            </th>
            <td>
              <ul>
                {studentInfo[0] ? studentList(studentInfo[1]) : <li key='x'>Loading...</li>}
              </ul>
            </td>
          </tr>
          
          <tr>
            <th>
              Committed Students:
            </th>
            <td>
              <ul>
                {studentInfo[0] ? studentList(studentInfo[2]) : <li key='x'>Loading...</li>}
              </ul>
            </td>
          </tr>

        </tbody></table>

        <div className="buttonArea">
          { // if user is student
            userLocal &&
            userRole && 
            userRole.includes('student') ?
            <>
              { // if user is approved for project
                studentInfo[1][0] &&
                'id' in studentInfo[1][0] &&
                studentInfo[1].map(student => student.id).includes(userId) ?
                <>
                  { /*
                    three cases:
                    if user committed to any project
                    then
                      user committed to the project
                      - show remove commit button
                      user not committed to the project
                      - don't show commit button
                    if user not committed to any project
                    then
                      - show commit button
                    */
                    user && user.committed_project ?
                    <> 
                      { // if user is committed to the project
                        user.committed_project.includes(project.id) ?
                      <button type="button" onClick={() => handleCommit()}>Remove Project Commitment</button>
                      :
                      <></>
                      } 
                    </>
                    :
                    <button type="button" onClick={() => handleCommit()}>Commit To Project</button>
                  }
                </>
                :
                <button type="button" onClick={() => handleApply()}>
                { // if user is applied to project
                  studentInfo[0][0] &&
                  'id' in studentInfo[0][0] &&
                  studentInfo[0].map(student => student.id).includes(userId) ? 
                    "Remove Project Application" 
                  :
                    "Apply To Project"
                }
                </button>
              }
            </>
            :
            <></>
          }

          { // if user is admin
            userLocal &&
            userRole && 
            userRole.includes('admin') ?
            <>
              <button type="button" onClick={() => handleEdit()}>Edit Project</button>
              <button type="button" onClick={() => handleDelete()}>Delete Project</button>
            </>
            :
            <></>
          }
          
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </>
  );
}
