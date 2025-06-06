import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Directory from "./pages/Directory";
import Applications from "./pages/Applications";
import Proposal from "./pages/Applications/Proposal";
import User from "./pages/User";
import Project from "./pages/Project";
import TestGrid from './TestGrid';
import Approval from "./pages/Applications/Approval";
import EditProject from "./pages/EditProject";
import EditUser from "./pages/EditUser";
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/proposal" element={<Proposal />} />
          <Route path="/user/:id" element={<User />} />
          <Route path="/project/:id" element={<Project />} />
          <Route path="/test" element={<TestGrid />} />
          <Route path="/applications/approval" element={<Approval />} />
          <Route path="/edit-project/:id" element={<EditProject />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
