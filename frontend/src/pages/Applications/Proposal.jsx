import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // <== use your axios instance here

import Navbar from "../Navbar";

import "../../styles/Form.css";

export default function Proposal() {
  // Right now files are not required but they should be eventually

  const [formData, setFormData] = useState({
    approved: 0,

    year: new Date().getFullYear() + 1,
    semester: "",

    org_name: "",
    org_category: "",
    org_industry: "",
    org_website: "",
    org_address: "",
    org_document: "",

    contact_first_name: "",
    contact_last_name: "",
    contact_position_title: "",
    contact_phone: "",
    contact_email: "",

    project_name: "",
    project_description: "",
    project_criteria: "",
    project_skillset: "",
    project_instructions: "",
    project_benefits: "",
    project_document: "",
    other_projects: 0,

    open_house: 0,
    employment_history: "",
    employment_opportunities: "",
    committed: "",
    agreement_document: "",

    applied_students: "",
    approved_students:  "",
    confirmed_students: ""
  });

  //JSON.parse(localStorage.getItem("user")).last_name;

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔒 Protect this route
  useEffect(() => {
    if (!user || (!user.roles.includes('sponsor') && !user.roles.includes('admin'))) {
      navigate('/');
    }
  }, [user, navigate]);


  const handleChange = (e) => {
    if (e.target.name.includes("emp_")) {
      var emp = {
        emp_0: document.getElementById("check0a").checked ? document.getElementById("check0a").value : null,
        emp_1: document.getElementById("check1a").checked ? document.getElementById("check1a").value : null,
        emp_2: document.getElementById("check2a").checked ? document.getElementById("check2a").value : null,
        emp_3: document.getElementById("check3a").checked ? document.getElementById("check3a").value : null,
        emp_4: document.getElementById("check4a").checked ? document.getElementById("check4aOtherInput").value : null
      }
      setFormData({ ...formData, "employment_opportunities": Object.values(emp).filter(Boolean).join(';') });
    }
    else if (e.target.name.includes("com_")) {
      var com = {
        com_0: document.getElementById("check0b").checked ? document.getElementById("check0b").value : null,
        com_1: document.getElementById("check1b").checked ? document.getElementById("check1b").value : null,
        com_2: document.getElementById("check2b").checked ? document.getElementById("check2b").value : null,
        com_3: document.getElementById("check3b").checked ? document.getElementById("check3b").value : null,
        com_4: document.getElementById("check4b").checked ? document.getElementById("check4b").value : null,
        com_5: document.getElementById("check5b").checked ? document.getElementById("check5b").value : null,
        com_6: document.getElementById("check6b").checked ? document.getElementById("check6b").value : null,
        com_7: document.getElementById("check7b").checked ? document.getElementById("check7b").value : null,
        com_8: document.getElementById("check8b").checked ? document.getElementById("check8b").value : null,
        com_9: document.getElementById("check9b").checked ? document.getElementById("check9b").value : null,
        com_10: document.getElementById("check10b").checked ? document.getElementById("check10b").value : null,
      }
      setFormData({ ...formData, "committed": Object.values(com).filter(Boolean).join(';') });
    }
    else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/createproject", formData);  // <== call backend using api instance
      setSuccess("Project Proposal Submitted! Redirecting to home...");
      setError("");
      setTimeout(() => navigate("/"), 2000); 

    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setSuccess("");
    }
  };

  console.log(formData)

  return (
    <>
      <Navbar currentPage={"applications"}/>

      <div className="proposal page">

        <h1>Sponsor Proposal Application</h1>

        <form className={"proposal form"} onSubmit={handleSubmit}>
          
          <h2>Time Frame</h2>

          <label className="label">Semester *</label>
          <select name="semester" onChange={handleChange} required >
            <option style={{display:"none"}} defaultValue>-- please select --</option>
            <option value="fall">Fall (Sep to December)</option>
            <option value="spring">Spring (January to May)</option>
            <option value="summer">Summer (May to August)</option>
            <option value="winter+spring">Winter-Break + Spring (Two-semester)</option>
          </select>

          <label className="label">Year *</label>
          <input name="year" defaultValue={new Date().getFullYear() + 1} min={new Date().getFullYear()} max={new Date().getFullYear()+10} onChange={handleChange} required type="number"/>
          
          <h2>Company Information</h2>

          <label className="label">Company/Organization Name *</label>
          <input name="org_name" value={formData.org_name} onChange={handleChange} required />

          <label className="label">Which best describes your organization or affiliation? *</label>
          <select name="org_category" onChange={handleChange} required >
            <option style={{display:"none"}} defaultValue>-- please select --</option>
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

          <label className="label">Which best describes your industry? *</label>
          <select name="org_industry" onChange={handleChange} required >
          <option style={{display:"none"}} defaultValue>-- please select --</option>
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

          <label className="label">Website URL</label>
          <input name="org_website" value={formData.org_website} onChange={handleChange} />

          <label className="label">Full Address (street, city, state, and zip code) *</label>
          <input name="org_address" value={formData.org_address} onChange={handleChange} required />

          <label className="label">Feel free to name and attach an additional brochure or document about your organization here, keeping the file size limited to 500K (i.e. 0.5 MB MAX)</label>
          <input name="org_document" value={formData.org_document} onChange={handleChange} type="file"/>


          <h2>Contact Information</h2>

          <label className="label">Contact First Name *</label>
          <input name="contact_first_name" value={formData.contact_first_name} onChange={handleChange} required />

          <label className="label">Contact Last Name *</label>
          <input name="contact_last_name" value={formData.contact_last_name} onChange={handleChange} required />

          <label className="label">Contact Position/Title *</label>
          <input name="contact_position_title" value={formData.contact_position_title} onChange={handleChange} required />

          <label className="label">Contact Phone *</label>
          <input name="contact_phone" value={formData.contact_phone} onChange={handleChange} required />

          <label className="label">Contact Email *</label>
          <input name="contact_email" value={formData.contact_email} onChange={handleChange} required />

          
          <h2>Project Proposal</h2>

          <label className="label">Project Title *</label>
          <input name="project_name" value={formData.project_name} onChange={handleChange} required />

          <label className="label">Project Description  *
            <span className="characterCount"> ({formData.project_description.length} / 2500 max. characters)</span>
          </label> 
          <textarea name="project_description" rows="4" maxLength="2500" value={formData.project_description} onChange={handleChange} required />

          <label className="label">Project Completion Criteria: [Define specific project completion criteria that cannot be changed without approval from the instructor and team.] *
            <span className="characterCount"> ({formData.project_criteria.length} / 2500 max. characters)</span>
          </label>
          <textarea name="project_criteria" rows="4" maxLength="2500" value={formData.project_criteria} onChange={handleChange} required />

          <label className="label">Expected Skillset / Background: What kind of students are you seeking for your project? *
            <span className="characterCount"> ({formData.project_skillset.length} / 2500 max. characters)</span>
          </label>
          <textarea name="project_skillset" rows="4" maxLength="2500" value={formData.project_skillset} onChange={handleChange} required />

          <label className="label">Special Instructions: (Tools, Deadlines, Constraints, etc.)
            <span className="characterCount"> ({formData.project_instructions.length} / 2500 max. characters)</span>
          </label>
          <textarea name="project_instructions" rows="4" maxLength="2500" value={formData.project_instructions} onChange={handleChange} />

          <label className="label">Are there any additional distinctive benefits that our students can acquire by contributing to your project, in addition to the learning experience and the aspects you have already highlighted?
            <span className="characterCount"> ({formData.project_benefits.length} / 2500 max. characters)</span>
          </label>
          <textarea name="project_benefits" rows="4" maxLength="2500" value={formData.project_benefits} onChange={handleChange} />

          <label className="label">Please feel free to attach one key document about your project.</label>
          <input name="project_document" value={formData.project_document} onChange={handleChange} type="file"/>

          <label className="label">Do you have other projects ? If so, please submit additional proposals *</label>
          <select name="other_projects" onChange={handleChange} required >
            <option style={{display:"none"}} defaultValue>-- please select --</option>
            <option value={0} defaultValue>No</option>
            <option value={1}>Yes</option>
          </select>


          <h2>Other Information</h2>

          <label className="label">Have you previously employed any of our students? If yes, please provide some details.
            <span className="characterCount"> ({formData.employment_history.length} / 2500 max. characters)</span>
          </label>
          <textarea name="employment_history" rows="4" maxLength="2500" value={formData.employment_history} onChange={handleChange} />

          <label className="label">In addition to our team-based project courses, are you interested in offering part-time or full-time jobs to our students? *</label>
          <div className="area">
            <span className="areaChild">
              <input id="check0a" name="emp_0" value="I am only interested in your team-based project course services" type="checkbox" onChange={handleChange} />
              <label className="areaLabel" htmlFor="check0a">I am only interested in your team-based project course services</label>
            </span>
            <span className="areaChild">
              <input id="check1a" name="emp_1" value="I have part-time job opportunities now" type="checkbox" onChange={handleChange} />
              <label className="areaLabel" htmlFor="check1a">I have part-time job opportunities now</label>
            </span>
            <span className="areaChild">
              <input id="check2a" name="emp_2" value="I have full-time job opportunities now" type="checkbox" onChange={handleChange} />
              <label className="areaLabel" htmlFor="check2a">I have full-time job opportunities now</label>
            </span>
            <span className="areaChild">
              <input id="check3a" name="emp_3" value="I will have internship opportunities in the future" type="checkbox" onChange={handleChange} />
              <label className="areaLabel" htmlFor="check3a">I will have internship opportunities in the future</label>
            </span>
            <span className="areaChild">
              <input id="check4a" name="emp_4" value={document.getElementById("check4aOtherInput") ? document.getElementById("check4aOtherInput").value : ""} type="checkbox" onChange={handleChange} />
              <label className="areaLabel" htmlFor="check4a">Other: </label>
              <input id="check4aOtherInput" className="otherInput" htmlFor="check4a" name="emp_4" onChange={handleChange} />
            </span>
          </div>

          <label className="label">You are invited to the sponsors' "OPEN HOUSE" presentation event for our students. Attendance is mandatory. Sponsors will showcase projects and recruit teams at the event. Selected teams will be available to start the project immediately.</label>
          <div className="area">
            <span className="areaChild">
              <input id="radio0" name="open_house" value="Yes, I will be able to attend the sponsors' open house as instructed in the invitation email" type="radio" onChange={handleChange} />
              <label className="areaLabel" htmlFor="radio0">Yes, I will be able to attend the sponsors' open house as instructed in the invitation email</label>
            </span>
            <span className="areaChild">
              <input id="radio1" name="open_house" value="Alternative arrangements have been made and approved in advance with the capstone leadership" type="radio" onChange={handleChange} />
              <label className="areaLabel" htmlFor="radio1">Alternative arrangements have been made and approved in advance with the capstone leadership</label>
            </span>
            <span className="areaChild">
              <input id="radio2" name="open_house" value="I will not be able to participate in the open house (this may cancel your proposal)" type="radio" onChange={handleChange} />
              <label className="areaLabel" htmlFor="radio2">I will not be able to participate in the open house (this may cancel your proposal)</label>
            </span>
          </div>

          <label className="label">As a project sponsor, please check everything regarding your approach to working with our students and program.</label>
          <label className="label">Our rigorous review process is vital for crafting exceptional student experiences and handpicking compassionate sponsors deeply committed to education and career development. *</label>
          <div className="area">
            <span className="areaChild">
              <input id="check0b" name="com_0" value="I am committed to providing students with a rewarding learning experience and ensuring that student learning is at the forefront of our project." type="checkbox" onChange={handleChange} />
              <label className="areaLabel" htmlFor="check0b">I am committed to providing students with a rewarding learning experience and ensuring that student learning is at the forefront of our project.</label>
            </span>
            <span className="areaChild">
              <input id="check1b" name="com_1" value="When working with students, I understand that they are not employees and I am willing to take the risk. They will do their best but may need time to learn, and their projects must be feasible within their capabilities and timeframe." type="checkbox" onChange={handleChange} />
              <label className="areaLabel" htmlFor="check1b">When working with students, I understand that they are not employees and I am willing to take the risk. They will do their best but may need time to learn, and their projects must be feasible within their capabilities and timeframe.</label>
            </span>
            <span className="areaChild">
              <input id="check2b" name="com_2" value="I will strive to align the project with students' interests, backgrounds, and aspirations, even if it requires adjusting the project scope." type="checkbox" onChange={handleChange} />
              <label className="areaLabel" htmlFor="check2b">I will strive to align the project with students' interests, backgrounds, and aspirations, even if it requires adjusting the project scope.</label>
            </span>
            <span className="areaChild">
              <input id="check3b" name="com_3" value="My commitment is to align with the capstone course learning outcomes and pedagogical strategies and deliverables." type="checkbox" onChange={handleChange} />
              <label className="areaLabel" htmlFor="check3b">My commitment is to align with the capstone course learning outcomes and pedagogical strategies and deliverables.</label>
            </span>
            <span className="areaChild">
              <input id="check4b" name="com_4" value="I will ensure precise project requirements and reasonable expectations." type="checkbox" onChange={handleChange} />
              <label className="areaLabel" htmlFor="check4b">I will ensure precise project requirements and reasonable expectations.</label>
            </span>
            <span className="areaChild">
              <input id="check5b" name="com_5" value="I'll prioritize accommodating students' schedules without impacting their other commitments." type="checkbox" onChange={handleChange} />
              <label className="areaLabel" htmlFor="check5b">I'll prioritize accommodating students' schedules without impacting their other commitments.</label>
            </span>
            <span className="areaChild">
              <input id="check6b" name="com_6" value="I will facilitate all resources necessary to enable students to complete the project successfully." type="checkbox" onChange={handleChange} />
              <label className="areaLabel" htmlFor="check6b">I will facilitate all resources necessary to enable students to complete the project successfully.</label>
            </span>
            <span className="areaChild">
              <input id="check7b" name="com_7" value="I will provide proper compensation for transportation if the students need to travel a long distance." type="checkbox" onChange={handleChange} />
              <label className="areaLabel" htmlFor="check7b">I will provide proper compensation for transportation if the students need to travel a long distance.</label>
            </span>
            <span className="areaChild">
              <input id="check8b" name="com_8" value="I will communicate at least weekly with the students and respond promptly to their questions via email, Discord or phone, etc." type="checkbox" onChange={handleChange} />
              <label className="areaLabel" htmlFor="check8b">I will communicate at least weekly with the students and respond promptly to their questions via email, Discord or phone, etc.</label>
            </span>
            <span className="areaChild">
              <input id="check9b" name="com_9" value="I will attend the virtual midterm and in-person final presentations showcase." type="checkbox" onChange={handleChange} />
              <label className="areaLabel" htmlFor="check9b">I will attend the virtual midterm and in-person final presentations showcase.</label>
            </span>
            <span className="areaChild">
              <input id="check10b" name="com_10" value="I am committed to maintaining open communication with capstone leadership and addressing any project or team member issues." type="checkbox" onChange={handleChange} />
              <label className="areaLabel" htmlFor="check10b">I am committed to maintaining open communication with capstone leadership and addressing any project or team member issues.</label>
            </span>
          </div>

          <label className="label">Please upload the <a href="https://fs7.formsite.com/eljabiri2/images/Acknowledgment-Agreement-Aug19.pdf">YWCC CAPSTONE PROGRAM</a> signed & dated acknowledgment agreement here. *</label>
          <input name="agreement_document" value={formData.agreement_document} onChange={handleChange} type="file"/>
          
          <button type="submit">Submit</button>

          {success && <p style={{ color: "green" }}>{success}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

        </form>

      </div>
    </>
  );
}
