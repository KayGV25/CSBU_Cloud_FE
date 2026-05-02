import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "sonner";
import { useUserContext } from "../../context/UserContext";
import Link from "next/link";
import { API_URL } from "../../env";


const Register = () => {
  const [formData, setFormData] = useState({
    id: "",
    fullname: "",
    department: "unknown",
    password: "",
    role: "user"
  });
  const [isSigningUp, setIsSigningUp] = useState(false);
  const router = useRouter()
  const {user} = useUserContext();

  console.log(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    try {
      setIsSigningUp(true);
      const data = await axios.post(`${API_URL}/api/v1/auth/register`, formData)
      toast.success("Create Account Successfully!!!");
      // console.log(data);
      router.push("/login");
    } catch (error){
      toast.error(`Error occured: ${error}`);
    } finally {
      setFormData({
        id: "",
        fullname: "",
        department: "unknown",
        password: "",
        role: "user"
      });
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
          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="id"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Employee ID
            </label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              placeholder="Enter your employee ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-100 focus:border-indigo-300"
              required
            />
          </div>

          {/* ID Field */}
          <div className="mb-4">
            <label
              htmlFor="fullname"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-100 focus:border-indigo-300"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-100 focus:border-indigo-300"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Register
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
