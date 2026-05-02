import { useEffect, useState } from "react"
import { useUserContext } from "../../../context/UserContext"
import Layout from "../../../components/Layout";
import { Eye, CircleX, CheckCircle } from "lucide-react";
// import { Button, Modal, Form, Input, DatePicker, Select } from 'antd'
import "../../../styles/Home.module.css"
import { toast } from "sonner";
// import dayjs from "dayjs";
import { API_URL } from "../../../env";


export default function EmployeeTasksManagement() {
  const { user } = useUserContext();
  const [tasks, setTasks] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchID, setSearchID] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/v1/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      if (!response.ok) throw new Error("Failed to delete task");
      fetchTaskByEmployee();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project!");
    }
  }

  const updateTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/v1/tasks/${taskId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      if (!response.ok) throw new Error("Failed to update tasks");
      fetchTaskByEmployee();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project!");
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchTaskByEmployee = async () => {
    const token = localStorage.getItem("token");
    // const dataToPass = { departmentId: user?.department }
    try {
      const response = await fetch(`${API_URL}/api/v1/tasks/${user?.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks!");
    }
  }

  useEffect(() => {
    fetchTaskByEmployee();
  }, [user?.id]);

  const filteredTasks = tasks?.filter((task) => {
    const matchesName = task.taskName
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesId = task.id
      .toLowerCase()
      .includes(searchID.toLowerCase());
    return matchesName && matchesId;
  });

  if (user && user.role !== "USER") {
    return (
      <Layout>
        <div className="flex justify-center items-center text-3xl">You are not allowed to access this page</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6 w-full bg-white shadow-md rounded-md h-full">
        <div className="flex justify-center items-center text-3xl">My tasks</div>
        <SearchBar searchName={searchName} setSearchName={setSearchName} searchID={searchID} setSearchID={setSearchID}/>
        <Table showModal={showModal} tasks={filteredTasks} deleteTask={deleteTask} updateTask={updateTask} />
      </div>
    </Layout>
  )
}

const SearchBar = ({ searchName, setSearchName, searchID, setSearchID }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 mt-4">
    <input
      type="text"
      placeholder="Search by Task ID"
      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
      value={searchID}
      onChange={e => setSearchID(e.target.value)}
    />

    <input
      type="text"
      placeholder="Search by Task Name"
      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
      value={searchName}
      onChange={e => setSearchName(e.target.value)}
    />
  </div>
);

const Table = ({ tasks, deleteTask, updateTask }) => {

  return (
    <div className="overflow-x-auto mt-8">
      <table className="table-auto w-full text-sm text-left border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Task ID</th>
            <th className="border px-4 py-2">Task Name</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Deadline</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks?.map((task, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{task.id}</td>
              <td className="border px-4 py-2">{task.taskName}</td>
              <td className="border px-4 py-2">{task.description}</td>
              <td className="border px-4 py-2">{task.deadline}</td>
              <td className="border px-4 py-2">
                {task.status ? (
                  <div className="text-gray-600 flex items-center justify-center rounded-full bg-[rgb(148,239,105)] py-1 px-4 shadow-md">
                    Done
                  </div>
                ) :
                  // row.Status === "In Progress" ? 
                  (
                    <div className="text-gray-600 flex items-center justify-center rounded-full bg-[rgb(232,239,105)] py-1 px-4 shadow-md">
                      In Progress
                    </div>
                    // ) : (
                    //   <div className="text-gray-600 flex items-center justify-center rounded-full bg-[rgb(239,105,105)] py-1 px-4 shadow-md">
                    //     Due
                    //   </div>
                  )
                }
              </td>
              <td className="border">
                {task.status ? (
                  <div className=" flex items-center justify-center rounded-full gap-7">
                    {/* <button className=""><Eye className="w-8 h-8" /></button> */}
                    <button><CircleX className="text-[#de0d0d] w-8 h-8" onClick={() => deleteTask(task.id)} /></button>
                  </div>
                ) : (
                  <div className=" flex items-center justify-center rounded-full gap-7">
                    <button><CheckCircle className="text-green-400 w-8 h-8" onClick={() => updateTask(task.id)} /></button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
}