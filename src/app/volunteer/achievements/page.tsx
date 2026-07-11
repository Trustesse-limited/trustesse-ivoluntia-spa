"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import YesAchievements from "./volunteer/achievements/yesApprec";

export default function VolunteerAchievementsPage() {

  const [achievements, setAchievements] = React.useState(false);
  return (

    
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6"
    >
      {/* Header */}
     
      {/* Yes Achievements  */}


      {/* No Achievements Yet Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center justify-center m-auto py-16 px-6"
      >
        {/* Illustration */}
        <div className="relative w-64 h-64 mb-8">
          <Image
            src="/illustrations/no achievment.svg"
            alt="No achievements yet"
            fill
            className="object-contain"
          />
        </div>

        {/* Main Text */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          No achievements yet
        </h2>

        {/* Sub Text */}
        <p className="text-gray-600 text-center max-w-md mb-8">
          Complete volunteer programs to earn certificates and badges.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Primary Button - Explore Programs */}
          <Link
            href="/volunteer/programs"
            className="px-6 py-3 bg-[#0E68DC] text-white rounded-lg font-medium hover:bg-[#0E68DC]/90 transition-colors text-center"
          >
            Explore Programs
          </Link>

          {/* Secondary Button - View Activity */}
          <Link
            href="/volunteer/activity"
            className="px-6 py-3 border border-[#0E68DC] text-[#0E68DC] rounded-lg font-medium hover:bg-[#0E68DC]/10 transition-colors text-center"
          >
            View Activity
          </Link>
        </div>
      </motion.div>
    </motion.section>
  );
}
