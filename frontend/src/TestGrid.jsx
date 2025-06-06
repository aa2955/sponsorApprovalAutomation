import { useNavigate } from "react-router-dom";
import { DataGrid } from "react-data-grid";

export default function TestGrid() {
  const navigate = useNavigate();

  const rows = [
    { id: 1, project_name: "AI Assistant", org_name: "OpenAI", semester: "Fall", year: 2025 },
    { id: 2, project_name: "Health Tracker", org_name: "FitCo", semester: "Spring", year: 2025 }
  ];

  const columns = [
    { key: "project_name", name: "Project Name" },
    { key: "org_name", name: "Organization" },
    { key: "semester", name: "Semester" },
    { key: "year", name: "Year" }
  ];

  const handleRowClick = (args) => {
    console.log("Row clicked:", args.row);
    navigate(`/project/${args.row.id}`);
  };

  console.log("Component rendered with onRowClick");

  return (
    <div style={{ padding: 40 }}>
      <h2>Test DataGrid</h2>
      <DataGrid
        rows={rows}
        columns={columns}
        onRowClick={handleRowClick}
        rowHeight={40}
        className="rdg-light"
      />
    </div>
  );
}
