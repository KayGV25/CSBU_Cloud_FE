
import React, { useEffect } from "react";
import { useState } from "react";
import { useRouter } from 'next/router';
import { EmployeeManagement, FinanceManagement, ManagerManagement, AdminManagement } from "../data/NavBarData";

import {
  MdOutlineSpaceDashboard,
  MdOutlineSettings,
  MdOutlineLogout,
} from "react-icons/md/index";
import Link from "next/link";
import { useUserContext } from "../context/UserContext";

function SideNavbar() {
  const [isFinanceSubMenuOpen, setFinanceSubMenuOpen] = useState(false);
  const [isEmployeeSubMenuOpen, setEmployeeSubMenuOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [navEmployee, setNavEmployee] = useState([]);
  const { user, setUser } = useUserContext();
  const router = useRouter();
  console.log(user)

  useEffect(() => {
    if (user && user.role === "USER") {
      setNavEmployee(EmployeeManagement);
    }
    else if (user && user.role === "MANAGER") {
      setNavEmployee(ManagerManagement);
    }
    else if (user && user.role === "ADMIN") {
      setNavEmployee(AdminManagement);
    }
  }, [user])

  const handleSubMenuToggle = (setSubMenuOpen) => {
    setSubMenuOpen((prevState) => !prevState);
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  }

  return (
    <div>
      <div className="bg-white shadow-lg rounded-lg" >
        <button
          onClick={toggleSidebar}
          className="md:hidden p-4 text-gray-600 hover:text-white transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {isSidebarOpen === true && (<button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-gray-600 hover:text-white p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>)}
      </div>
      <div
        className={`h-screen bg-white shadow-lg md:w-70 w-2/7 overflow-auto fixed left-0 top-0 z-50 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static`}
      >
        <h1 className="flex gap-4 justify-center item-center mt-4">
          <span className="text-2xl md:pl-4 pl-0"><MdOutlineSpaceDashboard /></span>
          <span className="text-base text-center cursor-pointer font-bold text-blue-900 border-b border-gray-100 pb-4 w-full md:block hidden">CSBU Management</span>
        </h1>
        <div className="flex flex-col justify-between">
          {/* Top Section: Navigation Links */}
          <div className="p-3">
            <div className="space-y-4">
              <NavItem
                href="/dashboard"
                icon={<MdOutlineSpaceDashboard />}
                label="Dashboard"
              />
              {/* Emplyee Management */}
              <div>
                <div className="flex items-center gap-4 text-gray-600 hover:text-white hover:bg-gray-900 p-3 rounded-lg cursor-pointer transition duration-200 ">
                  <div className="text-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="24" height="24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                    </svg>

                  </div>
                  <span className="font-semibold  md:block">Employee Management</span>

                  {/* Dropdown button */}
                  <button
                    className="ml-auto p-1 transition-transform duration-200 "
                    onClick={() => handleSubMenuToggle(setEmployeeSubMenuOpen)}
                  >
                    {isEmployeeSubMenuOpen ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>

                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {isEmployeeSubMenuOpen && (
                  <div className="">
                    <SubMenu item={navEmployee} />
                  </div>
                )}
              </div>
              {/* Finance Management */}
              <div>
                <div
                  className="flex items-center gap-4 text-gray-600 hover:text-white hover:bg-gray-900 p-3 rounded-lg cursor-pointer transition duration-200 "
                  onClick={() => handleSubMenuToggle(setFinanceSubMenuOpen)}
                >
                  <div className="text-2xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 17l8 5 8-5m-16-5l8 5 8-5M4 7l8-5 8 5-8 5-8-5z"
                      />
                    </svg>
                  </div>
                  <span className="font-semibold  md:block">Finance Management</span>
                  {/* DropDown Button */}
                  <button
                    className="ml-auto p-1 transition-transform duration-200"
                  >
                    {isFinanceSubMenuOpen ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>

                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {isFinanceSubMenuOpen && (
                  <div className="">
                    <SubMenu item={FinanceManagement} />
                  </div>
                )}
              </div>

              {/* Active History */}
              {/* <NavItem
                href="/analytics"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                label="Active History"
              /> */}
              {/* Settings */}
              {/* <NavItem
                href="/settings"
                icon={<MdOutlineSettings />}
                label="System Configuration"
              /> */}
            </div>
          </div>

          {/* Bottom Section: Logout */}
          <div className="p-3">
            <button className="w-full flex items-center gap-4 text-gray-600 hover:text-white hover:bg-gray-900 p-3 rounded-lg transition duration-200" onClick={logout}>
              <MdOutlineLogout className="text-2xl" />
              <span className="font-semibold  md:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label }) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-4 text-gray-600 hover:text-white hover:bg-gray-900 p-3 rounded-lg cursor-pointer transition duration-200">
        <div className="text-2xl">{icon}</div>
        <span className="font-semibold  md:block">{label}</span>
      </div>
    </Link>
  );
}

const SubMenu = ({ item }) => {
  const { pathname } = useRouter();

  return (
    <div className="my-2 ml-8 flex flex-col space-y-4">
      {item?.map((subItem, idx) => {
        return (
          <Link key={idx} href={subItem.href}>
            <div
              className={`flex items-center gap-4 text-gray-600 hover:text-white hover:bg-gray-900 p-3 rounded-lg cursor-pointer transition duration-200 ${subItem.href === pathname ? 'font-bold' : ''
                }`}
            >
              <div className="text-2xl">{subItem.icon}</div>
              <span>{subItem.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default SideNavbar;
