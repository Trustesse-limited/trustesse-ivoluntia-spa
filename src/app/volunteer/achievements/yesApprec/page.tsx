"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FiAward,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiExternalLink,
  FiStar,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const achievementStats = [
  { label: "Achievements Earned", value: "12", icon: FiAward },
  { label: "Certificates Issued", value: "4", icon: FiCheckCircle },
  { label: "Volunteer Hours", value: "156h", icon: FiClock },
];

const certificates = [
  {
    title: "Community Tree Planting",
    organization: "Green Earth Foundation",
    date: "Aug 19, 2025",
    image: "/Apprec.svg",
  },
  {
    title: "Youth Education Bootcamp",
    organization: "Education First NGO",
    date: "Jul 28, 2025",
    image: "/Apprec.svg",
  },
];

const badges = [
  { title: "Community Hero", image: "/badge1.svg", active: true, description: "Outstanding community contribution" },
  { title: "Consistency Star", image: "/badge2.svg", active: true, description: "Volunteered regularly and often" },
  { title: "Milestone Achiever", image: "/badge3.svg", active: true, description: "Reached a major milestone" },
  { title: "Skill Contributor", image: "/nobadge.svg", active: false, description: "Share your skills in upcoming events" },
  { title: "Tree Planter", image: "/nobadge.svg", active: false, description: "Join environmental activities to unlock" },
  { title: "Event Champion", image: "/nobadge.svg", active: false, description: "Participate in more events to earn this badge" },
];

const milestones = [
  { label: "Complete 5 Programs", value: "5/5", complete: true },
  { label: "Earn 100 Volunteer Hours", value: "156/100", complete: true },
  { label: "Lead 3 Activities", value: "2/3", complete: false },
];

const history = [
  {
    date: "Aug 19, 2025",
    achievement: "Community Builder Certificate",
    program: "Community Tree Planting",
    type: "Certificate",
  },
  {
    date: "Jul 28, 2025",
    achievement: "Education Mentor Badge",
    program: "Youth Education Bootcamp",
    type: "Badge",
  },
  {
    date: "Jun 14, 2025",
    achievement: "100 Volunteer Hours",
    program: "Clean Water Access Project",
    type: "Milestone",
  },
];

export default function VolunteerAchievementsPage() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-950">
            Your Achievements
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Celebrate your impact and milestones on iVoluntia.
          </p>
        </div>

       <div className="flex items-center gap-4">
          <Image src="/trophy.svg" alt="trophy" width={60} height={60} />
          < div>
            <h2 className="text-lg font-bold text-gray-950">Your contribution Rank:</h2>
            <h4>Top 10% of volunteers in your city.</h4>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {achievementStats.map((stat, index) => {
          const StatIcon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="rounded-xl bg-[#0E68DC] p-5 text-white shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10">
                  <StatIcon className="text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-white/80">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)]">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-white p-5 shadow-sm"
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-950">
                Certificates
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Official appreciation certificates ready to view or download.
              </p>
            </div>
            <FiAward className="text-2xl text-[#0E68DC]" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {certificates.map((certificate) => (
              <article
                key={certificate.title}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <div className="relative aspect-[4/3] bg-gray-100">
                  <Image
                    src={certificate.image}
                    alt={`${certificate.title} certificate`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="font-semibold text-gray-950">
                      {certificate.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {certificate.organization}
                    </p> 
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiCalendar />
                    <span>{certificate.date}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#0E68DC] px-3 text-sm font-semibold text-[#0E68DC] transition hover:bg-[#0E68DC]/10">
                      <FiExternalLink />
                      View
                    </button>
                    <button className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#0E68DC] px-3 text-sm font-semibold text-white transition hover:bg-[#0E68DC]/90">
                      <FiDownload />
                      Download
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl bg-white p-5 shadow-sm"
        >
          
          <div className="space-y-4">
          <Image  src="/Apprec2.svg" alt="milestone" width={600} height={300} />
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <h2 className="font-semibold text-gray-950">156 Hours Volunteered in Total</h2>
              </div>
            </div>

            {milestones.map((milestone) => (
              <div
                key={milestone.label}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      milestone.complete
                        ? "bg-green-100 text-green-700"
                        : "bg-[#0E68DC]/10 text-[#0E68DC]"
                    }`}
                  >
                    {milestone.complete ? <FiCheckCircle /> : <FiTarget />}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {milestone.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-950">
                  {milestone.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(320px,0.7fr)_minmax(0,1fr)]">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl bg-white p-5 shadow-sm"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-950">Badges</h2>
            <FiStar className="text-2xl text-[#0E68DC]" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {badges.map((badge) => (
              <div
                key={badge.title}
                className={`rounded-xl border p-4 text-center ${
                  badge.active
                    ? "border-[#0E68DC]/20 bg-white"
                    : "border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                <div className="relative mx-auto mb-3 h-20 w-20 px-8">
                  <Image
                    src={badge.image}
                    alt={`${badge.title} badge`}
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-950">
                  {badge.title}
                </p>
                <p className="font-light">{badge.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="overflow-hidden rounded-xl bg-white shadow-sm"
        >
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-lg font-bold text-gray-950">
              Achievement History
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Recent certificates, milestones, and badges you have earned.
            </p>
          </div>

          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Achievement</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={`${item.date}-${item.achievement}`}>
                  <TableCell className="text-gray-600">{item.date}</TableCell>
                  <TableCell className="font-medium text-gray-950">
                    {item.achievement}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {item.program}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex rounded-full bg-[#0E68DC]/10 px-3 py-1 text-xs font-semibold text-[#0E68DC]">
                      {item.type}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </motion.section>
  );
}
