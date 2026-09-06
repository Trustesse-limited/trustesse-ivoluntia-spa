"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiSave, FiBell, FiLock, FiGlobe, FiMail, FiShield, FiDatabase, FiToggleLeft, FiToggleRight } from "react-icons/fi";

export default function AdminSettings() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: false,
    securityAlerts: true,
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: true,
    ipWhitelist: false,
  });

  const [system, setSystem] = useState({
    maintenanceMode: false,
    debugMode: false,
    autoBackup: true,
  });

  const handleNotificationToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof notifications]
    }));
  };

  const handleSecurityToggle = (key: string) => {
    setSecurity(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof security]
    }));
  };

  const handleSystemToggle = (key: string) => {
    setSystem(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof system]
    }));
  };

  return (
    <div className="p-2 sm:p-4 w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 w-full">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[#161616] truncate w-full">Settings</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your account and system preferences</p>
        </div>
        <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base flex items-center gap-2 flex-shrink-0">
          <FiSave className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 w-full">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
              <div className="w-6 h-6 sm:w-8 sm:h-10 lg:w-10 lg:h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <FiBell className="text-white text-xs sm:text-sm lg:text-base" />
              </div>
              <h2 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-[#073B78]">Notifications</h2>
            </div>

            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Email Notifications</label>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">Receive email updates about your account</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('emailNotifications')}
                  className="flex-shrink-0"
                >
                  {notifications.emailNotifications ? (
                    <FiToggleRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-600" />
                  ) : (
                    <FiToggleLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Push Notifications</label>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">Get push notifications on your device</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('pushNotifications')}
                  className="flex-shrink-0"
                >
                  {notifications.pushNotifications ? (
                    <FiToggleRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-600" />
                  ) : (
                    <FiToggleLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Weekly Reports</label>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">Receive weekly activity summaries</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('weeklyReports')}
                  className="flex-shrink-0"
                >
                  {notifications.weeklyReports ? (
                    <FiToggleRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-600" />
                  ) : (
                    <FiToggleLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Security Alerts</label>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">Get notified about security events</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('securityAlerts')}
                  className="flex-shrink-0"
                >
                  {notifications.securityAlerts ? (
                    <FiToggleRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-600" />
                  ) : (
                    <FiToggleLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 w-full">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center">
                <FiShield className="text-white text-sm sm:text-base" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#073B78]">Security</h2>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <label className="text-sm font-medium text-gray-700">Two-Factor Auth</label>
                  <p className="text-xs text-gray-500 mt-1">Add an extra layer of security</p>
                </div>
                <button
                  onClick={() => handleSecurityToggle('twoFactorAuth')}
                  className="flex-shrink-0"
                >
                  {security.twoFactorAuth ? (
                    <FiToggleRight className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  ) : (
                    <FiToggleLeft className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <label className="text-sm font-medium text-gray-700">Session Timeout</label>
                  <p className="text-xs text-gray-500 mt-1">Auto-logout after inactivity</p>
                </div>
                <button
                  onClick={() => handleSecurityToggle('sessionTimeout')}
                  className="flex-shrink-0"
                >
                  {security.sessionTimeout ? (
                    <FiToggleRight className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  ) : (
                    <FiToggleLeft className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <label className="text-sm font-medium text-gray-700">IP Whitelist</label>
                  <p className="text-xs text-gray-500 mt-1">Restrict access to specific IPs</p>
                </div>
                <button
                  onClick={() => handleSecurityToggle('ipWhitelist')}
                  className="flex-shrink-0"
                >
                  {security.ipWhitelist ? (
                    <FiToggleRight className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  ) : (
                    <FiToggleLeft className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 w-full">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <FiDatabase className="text-white text-sm sm:text-base" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#073B78]">System</h2>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                  <p className="text-xs text-gray-500 mt-1">Temporarily disable the platform</p>
                </div>
                <button
                  onClick={() => handleSystemToggle('maintenanceMode')}
                  className="flex-shrink-0"
                >
                  {system.maintenanceMode ? (
                    <FiToggleRight className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  ) : (
                    <FiToggleLeft className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <label className="text-sm font-medium text-gray-700">Debug Mode</label>
                  <p className="text-xs text-gray-500 mt-1">Enable detailed error logging</p>
                </div>
                <button
                  onClick={() => handleSystemToggle('debugMode')}
                  className="flex-shrink-0"
                >
                  {system.debugMode ? (
                    <FiToggleRight className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  ) : (
                    <FiToggleLeft className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <label className="text-sm font-medium text-gray-700">Auto Backup</label>
                  <p className="text-xs text-gray-500 mt-1">Automatically backup data daily</p>
                </div>
                <button
                  onClick={() => handleSystemToggle('autoBackup')}
                  className="flex-shrink-0"
                >
                  {system.autoBackup ? (
                    <FiToggleRight className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  ) : (
                    <FiToggleLeft className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <button className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                  Export Data
                </button>
                <button className="w-full px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
                  Clear Cache
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Additional Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 w-full"
      >
        <h2 className="text-lg sm:text-xl font-bold text-[#073B78] mb-4 sm:mb-6">Platform Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
            <input
              type="text"
              defaultValue="Trustesse Platform"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
            <select className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base">
              <option>UTC</option>
              <option>EST</option>
              <option>PST</option>
              <option>GMT</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base">
              <option>NGN (₦)</option>
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
