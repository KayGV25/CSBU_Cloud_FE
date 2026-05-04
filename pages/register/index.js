import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { API_URL } from "../../env";


const Register = () => {
  const [formData, setFormData] = useState({
    id: "",
    full_name: "",
    dob: "",
    department_id: "",
    yoe: 0,
    role: "EMPLOYEE",
    password: "",
  });
  const [departments, setDepartments] = useState([]);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/department`);
        if (!response.ok) throw new Error("Failed to fetch departments");
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSigningUp(true);
      const response = await fetch(`${API_URL}/api/v1/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: formData.id || undefined,
          full_name: formData.full_name,
          dob: formData.dob,
          department_id: formData.department_id,
          yoe: Number(formData.yoe),
          approved: false,
          role: formData.role,
          password: formData.password,
        }),
      });
      if (!response.ok) throw new Error("Registration failed");
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-md shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Register
        </h2>
        <form onSubmit={handleSubmit}>

          {/* Employee ID (optional) */}
          <div className="mb-4">
            <label htmlFor="id" className="block mb-2 text-sm font-medium text-gray-600">
              Employee ID <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              placeholder="Leave blank to auto-generate"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-100 focus:border-indigo-300"
            />
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label htmlFor="full_name" className="block mb-2 text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-100 focus:border-indigo-300"
              required
            />
          </div>

          {/* Date of Birth */}
          <div className="mb-4">
            <label htmlFor="dob" className="block mb-2 text-sm font-medium text-gray-600">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-100 focus:border-indigo-300"
              required
            />
          </div>

          {/* Department */}
          <div className="mb-4">
            <label htmlFor="department_id" className="block mb-2 text-sm font-medium text-gray-600">
              Department
            </label>
            <select
              id="department_id"
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-100 focus:border-indigo-300"
              required
            >
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.department_name} ({dept.id})
                </option>
              ))}
            </select>
          </div>

          {/* Years of Experience */}
          <div className="mb-4">
            <label htmlFor="yoe" className="block mb-2 text-sm font-medium text-gray-600">
              Years of Experience
            </label>
            <input
              type="number"
              id="yoe"
              name="yoe"
              value={formData.yoe}
              onChange={handleChange}
              min={0}
              placeholder="Enter years of experience"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-100 focus:border-indigo-300"
              required
            />
          </div>

          {/* Role */}
          <div className="mb-4">
            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-600">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-100 focus:border-indigo-300"
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-100 focus:border-indigo-300"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full px-4 py-2 font-bold text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
          >
            {isSigningUp ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
