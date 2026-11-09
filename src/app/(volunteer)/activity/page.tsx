"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiAward, FiHeart, FiFilter, FiTrendingUp } from "react-icons/fi";

interface ActivityItem {
  id: string;
  type: 'program' | 'donation' | 'achievement' | 'enrollment';
  title: string;
  description: string;
  date: string;
  time: string;
  location?: string;
  impact?: string;
  status?: 'completed' | 'ongoing' | 'upcoming';
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'program',
    title: 'Environmental Conservation Day',
    description: 'Participated in beach cleanup and planted 50 trees',
    date: '2024-02-15',
    time: '9:00 AM - 2:00 PM',
    location: 'Santa Monica Beach',
    impact: '50 trees planted, 200lbs trash collected',
    status: 'completed'
  },
  {
    id: '2',
    type: 'achievement',
    title: 'Eco Warrior Badge',
    description: 'Completed 10 environmental programs',
    date: '2024-02-10',
    time: '3:30 PM',
    impact: 'Level 5 Environmental Advocate'
  },
  {
    id: '3',
    type: 'donation',
    title: 'Youth Education Fund',
    description: 'Donated to support after-school programs',
    date: '2024-02-08',
    time: '11:45 AM',
    impact: '$50 contributed'
  },
  {
    id: '4',
    type: 'enrollment',
    title: 'Community Garden Project',
    description: 'Enrolled in urban farming initiative',
    date: '2024-02-05',
    time: '10:00 AM',
    location: 'Downtown Community Center',
    status: 'upcoming'
  },
  {
    id: '5',
    type: 'program',
    title: 'Senior Care Workshop',
    description: 'Assisted with technology training for elderly',
    date: '2024-02-01',
    time: '2:00 PM - 4:00 PM',
    location: 'Sunset Senior Center',
    impact: '15 seniors trained',
    status: 'completed'
  },
  {
    id: '6',
    type: 'achievement',
    title: '100 Hours Milestone',
    description: 'Reached 100 volunteer hours',
    date: '2024-01-28',
    time: '6:00 PM',
    impact: 'Dedicated Volunteer Award'
  }
];

const activityTypes = [
  { value: 'all', label: 'All Activities', icon: FiTrendingUp },
  { value: 'program', label: 'Programs', icon: FiUsers },
  { value: 'achievement', label: 'Achievements', icon: FiAward },
  { value: 'donation', label: 'Donations', icon: FiHeart },
  { value: 'enrollment', label: 'Enrollments', icon: FiCalendar }
];

export default function VolunteerActivityPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activities] = useState(mockActivities);

  const filteredActivities = selectedFilter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === selectedFilter);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'program': return <FiUsers className="text-blue-500" />;
      case 'achievement': return <FiAward className="text-yellow-500" />;
      case 'donation': return <FiHeart className="text-red-500" />;
      case 'enrollment': return <FiCalendar className="text-green-500" />;
      default: return <FiTrendingUp className="text-gray-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'ongoing': return 'bg-blue-100 text-blue-700';
      case 'upcoming': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            Activity
          </h1>
          <p className="text-gray-600 mt-1">Your volunteer history and contributions</p>
        </div>
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-500" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0E68DC] focus:border-transparent bg-white"
          >
            {activityTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Activities', value: activities.length, icon: FiTrendingUp, color: 'bg-blue-500' },
          { label: 'Programs Completed', value: activities.filter(a => a.type === 'program' && a.status === 'completed').length, icon: FiUsers, color: 'bg-green-500' },
          { label: 'Achievements', value: activities.filter(a => a.type === 'achievement').length, icon: FiAward, color: 'bg-yellow-500' },
          { label: 'Upcoming', value: activities.filter(a => a.status === 'upcoming').length, icon: FiCalendar, color: 'bg-purple-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                <stat.icon className="text-white text-xl" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
          </motion.div>
        ))}
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <FiTrendingUp className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No activities found for this filter</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg">{activity.title}</h3>
                      <p className="text-gray-600 mt-1">{activity.description}</p>
                    </div>
                    {activity.status && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-3">
                    <div className="flex items-center gap-1">
                      <FiCalendar className="text-xs" />
                      {formatDate(activity.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock className="text-xs" />
                      {activity.time}
                    </div>
                    {activity.location && (
                      <div className="flex items-center gap-1">
                        <FiMapPin className="text-xs" />
                        {activity.location}
                      </div>
                    )}
                  </div>
                  
                  {activity.impact && (
                    <div className="mt-3 px-4 py-2 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <span className="font-medium">Impact:</span> {activity.impact}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
