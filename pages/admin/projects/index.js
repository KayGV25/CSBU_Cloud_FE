import { CircleX, Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import Head from 'next/head';
import { Button, Modal, Form, Input, InputNumber, DatePicker, Select } from 'antd';
import { useUserContext } from '../../../context/UserContext';
import { toast } from 'sonner';
import moment from 'moment';
import dayjs from 'dayjs';
import { API_URL } from '../../../env';

export default function ProjectsPage() {
  const { user } = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchID, setSearchID] = useState("");

  const fetchProjects = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/v1/projects`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects!");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const showModal = (project = null) => {
    setIsModalOpen(true);
    setIsEditMode(!!project);
    setCurrentProject(project);
  };

  const hideModal = () => {
    setIsModalOpen(false);
    setCurrentProject(null);
  };

  const filteredProjects = projects?.filter((project) => {
    const matchesName = project.projectName
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesId = project.projectId
      .toLowerCase()
      .includes(searchID.toLowerCase());
    return matchesName && matchesId;
  });

  const handleFormSubmit = async (values) => {
    const token = localStorage.getItem("token");
    const url = `${API_URL}/api/v1/projects`

    const method = isEditMode ? "PUT" : "POST";
    // console.log(dayjs(values.endDate).format("YYYY-MM-DD"));
    const valueToPass = {
      projectId: isEditMode ? currentProject.projectId : values.projectId,
      projectName: values.projectName || null,
      startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(values.endDate).format("YYYY-MM-DD"),
      departmentId: values.departmentId || null,
      description: values.description || null,
      createdAt: moment(values.startDate).format("YYYY-MM-DD")
    }
    console.log(valueToPass);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(valueToPass),
      });

      if (!response.ok) throw new Error("Failed to save project");

      toast.success(isEditMode ? "Project updated successfully!" : "Project created successfully!");
      fetchProjects();
      hideModal();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project!");
    }
  };

  const deleteProject = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/v1/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      if (!response.ok) throw new Error("Failed to delete project");
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project!");
    }
  }

  if (user?.role !== "ADMIN") {
    return (
      <Layout>
        <div className="flex justify-center items-center text-3xl">
          You are not allowed to access this page.
        </div>
      </Layout>
    );
  }

  return (
    <div>
      <Head>
        <title>CSBU Management - Projects</title>
        <meta name="description" content="Manage your projects with ease." />
        <link rel="icon" href="/pro.ico" />
      </Head>
      <Layout>
        <div className="p-6 w-full bg-white shadow-md rounded-md h-full">
          <h1 className="text-2xl font-semibold mb-4">Projects Management</h1>
          <Button className="mb-4" onClick={() => showModal()}>
            Create Project
          </Button>
          <SearchBar searchID={searchID} setSearchID={setSearchID} searchName={searchName} setSearchName={setSearchName} />
          <ProjectsTable projects={filteredProjects} onEdit={showModal} deleteProject={deleteProject}/>
          <CreateEditProjectModal
            isModalOpen={isModalOpen}
            isEditMode={isEditMode}
            project={currentProject}
            handleCancel={hideModal}
            handleSubmit={handleFormSubmit}
          />
        </div>
      </Layout>
    </div>
  );
}

const SearchBar = ({ searchName, setSearchName, searchID, setSearchID }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
    <input
      type="text"
      placeholder="Search by Project ID"
      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
      value={searchID}
      onChange={e => setSearchID(e.target.value)}
    />

    <input
      type="text"
      placeholder="Search by Project Name"
      className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
      value={searchName}
      onChange={e => setSearchName(e.target.value)}
    />
    {/* <select className="border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500">
      <option>Select year</option>
      <option>2024</option>
      <option>2023</option>
    </select> */}
    <div className="flex space-x-2">
      {/* <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition flex items-center">
        <Search size={15} />
        <span className="ml-2">Search</span>
      </button>
      <button className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition flex items-center">
        <X size={15} />
        <span className="ml-2">Reset</span>
      </button> */}
    </div>
  </div>
);

const ProjectsTable = ({ projects, onEdit, deleteProject }) => (
  <div className="overflow-x-auto">
    <table className="table-auto w-full text-sm text-left border-collapse border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">Project ID</th>
          <th className="border px-4 py-2">Project Name</th>
          <th className="border px-4 py-2">Start Date</th>
          <th className="border px-4 py-2">End Date</th>
          <th className="border px-4 py-2">Department</th>
          <th className="border px-4 py-2">Description</th>
          <th className="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.projectId} className="hover:bg-gray-100">
            <td className="border px-4 py-2">{project.projectId}</td>
            <td className="border px-4 py-2">{project.projectName}</td>
            <td className="border px-4 py-2">{project.startDate}</td>
            <td className="border px-4 py-2">{project.endDate}</td>
            <td className="border px-4 py-2">{project.departmentId}</td>
            <td className="border px-4 py-2">{project.description}</td>
            <td className="flex gap-2 items-center justify-start border px-4 py-2">
              <Button size="small" onClick={() => onEdit(project)}>
                Edit
              </Button>
              <div className="rounded-full">
                {/* <button className=""><Eye className="w-8 h-8" /></button> */}
                <button><CircleX className="text-[#de0d0d] w-8 h-10" onClick={() => deleteProject(project.projectId)} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CreateEditProjectModal = ({ isModalOpen, isEditMode, project, handleCancel, handleSubmit }) => {
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState(null);
  const [department, setDepartment] = useState(null);

  useEffect(() => {
    if (isEditMode && project) {
      form.setFieldsValue({
        projectName: project.projectName,
        // startDate: new Date(project.startDate),
        // endDate: new Date(project.endDate),
        department: project.departmentId,
        description: project.description,
      });
    } else {
      form.resetFields();
    }
  }, [isEditMode, project, form]);

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
    <Modal
      title={isEditMode ? "Edit Project" : "Create New Project"}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} className="bg-red-500 text-white">
          Cancel
        </Button>,
        <Button
          key="submit"
          onClick={() => form.validateFields().then((values) => handleSubmit({ ...values, departmentId: department }))}
          className="bg-green-500 text-white"
        >
          {isEditMode ? "Update" : "Create"}
        </Button>,
      ]}
      width={850}
    >
      <Form form={form} layout="vertical">
        {!isEditMode && <Form.Item
          name="projectId"
          label="Project Id"
          rules={[{ required: true, message: "Please enter the project ID" }]}
        >
          <Input size="large" />
        </Form.Item>}
        <Form.Item
          name="projectName"
          label="Project Name"
          rules={[{ required: true, message: "Please enter the project name" }]}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: "Please select the start date" }]}
        >
          <DatePicker size="large" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="endDate"
          label="End Date"
          rules={[{ required: true, message: "Please select the end date" }]}
        >
          <DatePicker size="large" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="department"
          label="Department"
          rules={[{ required: true, message: "Please select a department" }]}
        >
          <Select
            value={department}
            onChange={(value) => setDepartment(value)}
            style={{ width: "100%" }}
          >
            {/* Add the options for departments */}
            {departments && departments.map((department) =>
              <Select.Option key={department.departmentId} value={department.departmentId}>{department.departmentName}</Select.Option>
            )}
          </Select>
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea size="large" />
        </Form.Item>
      </Form>
    </Modal>
  );
};