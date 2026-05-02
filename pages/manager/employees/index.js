import { useUserContext } from "../../../context/UserContext";
import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { API_URL } from "../../../env";


export default function ManagerScreen() {
  const { user } = useUserContext();
  console.log(user?.department);
  const [employees, setEmployees] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchID, setSearchID] = useState("");

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    const dataToPass = { department: user?.department }
    try {
      const response = await fetch(`${API_URL}/api/v1/users/department`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToPass)
      });

      if (!response.ok) throw new Error("Failed to fetch employees");

      const employeeData = await response.json();
      setEmployees(employeeData);
    } catch (error) {
      console.error("Error occured:", error);
      toast.error("Something went wrong!!!");
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, [user?.department]);

  const filteredEmployee = employees?.filter((user) => {
    const matchesName = user.fullname
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesId = user.id
      .toLowerCase()
      .includes(searchID.toLowerCase());
    return matchesName && matchesId;
  });

  if (user && user.role !== "MANAGER") {
    return (
      <Layout>
        <div className="flex justify-center items-center text-3xl">You are not allowed to access this page</div>
      </Layout>
    )
  }
  return (
    <Layout>
      <div className="p-6 w-full bg-white shadow-md rounded-md h-full">
        <div className="flex justify-center items-center text-3xl">Your Department</div>
        <SearchBar searchID={searchID} setSearchID={setSearchID} searchName={searchName} setSearchName={setSearchName}/>
        <Table employees={filteredEmployee}/>
      </div>
    </Layout>
  )
}

const SearchBar = ({ searchName, setSearchName, searchID, setSearchID }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 mt-4">
    <input
      type="text"
      placeholder="Search by Employee ID"
      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
      value={searchID}
      onChange={e => setSearchID(e.target.value)}
    />

    <input
      type="text"
      placeholder="Search by Employee Name"
      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
      value={searchName}
      onChange={e => setSearchName(e.target.value)}
    />
    {/* <select
      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
      value={searchRole}
      onChange={e => setSearchRole(e.target.value)}
    >
      <option value="">All roles</option>
      <option value="ADMIN">Admin</option>
      <option value="MANAGER">Manager</option>
      <option value="USER">User</option>
    </select> */}
  </div>
);

const Table = ({employees}) => {
  return (
    <div className="overflow-x-auto mt-8">
      <table className="table-auto w-full text-sm text-left border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Employee ID</th>
            <th className="border px-4 py-2">Employee Name</th>
            <th className="border px-4 py-2">Department</th>
            <th className="border px-4 py-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {employees?.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{employee.id}</td>
              <td className="border px-4 py-2">{employee.fullname}</td>
              <td className="border px-4 py-2">{employee.department}</td>
              <td className="border px-4 py-2">{employee.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
