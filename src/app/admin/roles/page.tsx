"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiEdit2, FiTrash2, FiShield, FiUsers, FiSettings } from "react-icons/fi";

export default function AdminRoles() {
  const [searchTerm, setSearchTerm] = useState("");

  const roles = [
    { 
      id: 1, 
      name: "Super Admin", 
      description: "Full system access with all permissions",
      permissions: ["Manage Organizations", "Manage Programs", "Manage Users", "Manage Roles", "View Reports", "System Settings"],
      userCount: 3,
      color: "bg-purple-100 text-purple-800"
    },
    { 
      id: 2, 
      name: "Organization Admin", 
      description: "Manage organization programs and volunteers",
      permissions: ["Manage Programs", "Manage Volunteers", "View Reports", "Organization Settings"],
      userCount: 45,
      color: "bg-blue-100 text-blue-800"
    },
    { 
      id: 3, 
      name: "Volunteer", 
      description: "Participate in programs and manage profile",
      permissions: ["View Programs", "Join Programs", "Manage Profile", "View Activity"],
      userCount: 1234,
      color: "bg-green-100 text-green-800"
    },
    { 
      id: 4, 
      name: "Program Manager", 
      description: "Manage specific programs within organization",
      permissions: ["Manage Assigned Programs", "Manage Volunteers", "View Program Reports"],
      userCount: 28,
      color: "bg-orange-100 text-orange-800"
    },
  ];

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roles Management</h1>
          <p className="text-gray-600 mt-2">Manage user roles and permissions</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Add Role
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredRoles.map((role, index) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            {/* Role Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${role.color} rounded-full flex items-center justify-center`}>
                  <FiShield className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-500">{role.userCount} users</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-600 hover:text-blue-900">
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-4">{role.description}</p>

            {/* Permissions */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Permissions:</h4>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission, idx) => (
                  <span
                    key={idx}
                    className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
