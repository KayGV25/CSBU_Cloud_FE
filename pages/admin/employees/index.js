import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { useUserContext } from "../../../context/UserContext";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
// import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { API_URL } from "../../../env";

export default function AdminScreen() {
  const { user } = useUserContext();
  const [userData, setUserData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchID, setSearchID] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [departments, setDepartments] = useState(null);
  const [searchDepartment, setSearchDepartments] = useState("");
  console.log(departments);

  const fetchAllUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/v1/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch users data");

      const userData = await response.json();
      setUserData(userData);
    } catch (error) {
      console.error("Error occured:", error);
      toast.error("Something went wrong!!!");
    }
  }

  const fetchDepartments = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/v1/departments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch departments");

      const departmentData = await response.json();
      setDepartments(departmentData);
    } catch (error) {
      console.error("Error occured:", error);
      toast.error("Something went wrong!!!");
    }
  }

  useEffect(() => {
    fetchAllUsers();
    fetchDepartments();
  }, []);

  const filteredEmployee = userData?.filter((user) => {
    const matchesName = user.fullname
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesId = user.id
      .toLowerCase()
      .includes(searchID.toLowerCase());
    const matchesRole = user.role
      .toLowerCase()
      .includes(searchRole.toLowerCase());
    const matchDepartment = user.department
      .toLowerCase()
      .includes(searchDepartment.toLowerCase());
    return matchesName && matchesId && matchesRole && matchDepartment;
  });

  if (user && user.role !== "ADMIN") {
    return (
      <Layout>
        <div className="flex justify-center items-center text-3xl">You are not allowed to access this page</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6 w-full bg-white shadow-md rounded-md h-full">
        <div className="flex justify-center items-center text-3xl">Manage your employee here</div>
        <SearchBar searchID={searchID} setSearchID={setSearchID} searchName={searchName} setSearchName={setSearchName} searchRole={searchRole} setSearchRole={setSearchRole} departments={departments} searchDepartment={searchDepartment} setSearchDepartments={setSearchDepartments}/>
        <Table userData={filteredEmployee} />
      </div>
    </Layout>
  )
}

const SearchBar = ({ searchName, setSearchName, searchID, setSearchID, searchRole, setSearchRole, departments, searchDepartment, setSearchDepartments }) => (
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
    <select
      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
      value={searchRole}
      onChange={e => setSearchRole(e.target.value)}
    >
      <option value="">All roles</option>
      <option value="ADMIN">Admin</option>
      <option value="MANAGER">Manager</option>
      <option value="USER">User</option>
    </select>
    <select
      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
      value={searchDepartment}
      onChange={e => setSearchDepartments(e.target.value)}
    >
      <option value="">All departments</option>
      {departments?.map(department => (
        <option key={department.departmentId} value={department.departmentId}>{department.departmentName}</option>
      ))}
      {/* <option value="ADMIN">Admin</option>
      <option value="MANAGER">Manager</option>
      <option value="USER">User</option> */}
    </select>
  </div>
);

const Table = ({ userData }) => {
  const router = useRouter();

  const updateUser = async (userUpdate) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/v1/users/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userUpdate),
      });

      const data = await response.json();
      if (response.ok) {
        // Successfully saved the department
        console.log("User updated successfully", data);
        toast.success("User updated successfully");
      } else {
        // Handle any errors from the server
        console.error("Error updating user:", data);
        // You can show a toast or notification for error
      }
    } catch (error) {
      console.error("Error during user update:", error);
    } finally {
      router.reload();
    }
  }

  return (
    <div className="overflow-x-auto mt-8">
      <table className="table-auto w-full text-sm text-left border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Employee ID</th>
            <th className="border px-4 py-2">Employee Name</th>
            <th className="border px-4 py-2">Department</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user, index) => (

            <UserForm key={index} userData={user} onSave={updateUser} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

const UserForm = ({ userData, onSave }) => {
  const [edit, setEdit] = useState(false);
  const [editUser, setEditUser] = useState(userData);
  const [departments, setDepartments] = useState(null);

  const handleInputChange = (field, value) => {
    setEditUser((prev) => ({ ...prev, [field]: value }));
  };

  const saveUser = async () => {
    try {
      await onSave(editUser); // Call the save handler passed via props
      setEdit(false); // Exit edit mode after saving
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  const fetchDepartments = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/v1/departments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch departments");

      const departmentData = await response.json();
      setDepartments(departmentData);
    } catch (error) {
      console.error("Error occured:", error);
      toast.error("Something went wrong!!!");
    }
  }

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <tr key={userData.id} className="hover:bg-gray-100">
      {/* ID Field */}
      <td className="border px-4 py-2">
        {edit ? (
          <Input
            value={editUser.id}
            onChange={(e) => handleInputChange("id", e.target.value)}
            disabled // Disable ID editing if it's not allowed
          />
        ) : (
          userData.id
        )}
      </td>

      {/* Full Name Field */}
      <td className="border px-4 py-2">
        {edit ? (
          <Input
            value={editUser.fullname}
            onChange={(e) => handleInputChange("fullname", e.target.value)}
          />
        ) : (
          userData.fullname
        )}
      </td>

      {/* Department Field */}
      <td className="border px-4 py-2">
        {edit ? (
          <Select
            value={editUser.department}
            onChange={(value) => handleInputChange("department", value)}
            style={{ width: "100%" }}
          >
            {/* Add the options for departments */}
            {departments && departments.map((department, index) =>
              <Select.Option key={index} value={department.departmentId}>{department.departmentName}</Select.Option>
            )}
          </Select>
        ) : (
          userData.department
        )}
      </td>

      {/* Role Field */}
      <td className="border px-4 py-2">
        {edit ? (
          <Select
            value={editUser.role}
            onChange={(value) => handleInputChange("role", value)}
            style={{ width: "100%" }}
          >
            {/* Add the options for departments */}
            <Select.Option value="USER">User</Select.Option>
            <Select.Option value="MANAGER">Manager</Select.Option>
            <Select.Option value="ADMIN">Admin</Select.Option>
            {/* Add more options as needed */}
          </Select>
        ) : (
          userData.role
        )}
      </td>

      {/* Action Buttons */}
      <td className="border px-4 py-2">
        {edit ? (
          <div className="flex gap-2">
            {/* Save Button */}
            <Button size="small" className="mb-2" onClick={saveUser}>
              Save
            </Button>
            {/* Cancel Button */}
            <Button size="small" className="mb-2" onClick={() => setEdit(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button size="small" className="mb-2" onClick={() => setEdit(true)}>
            Edit
          </Button>
        )}
      </td>
    </tr>
  );
};