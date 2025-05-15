import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiCheck, FiAlertCircle, FiGrid, FiList } from 'react-icons/fi';

const Dashboard = () => {
  // Placeholder data
  const stats = [
    { label: 'Total Projects', value: 12, icon: <FiGrid />, color: 'bg-primary-light text-primary-dark' },
    { label: 'Tasks in Progress', value: 8, icon: <FiClock />, color: 'bg-warning/20 text-warning' },
    { label: 'Completed Tasks', value: 24, icon: <FiCheck />, color: 'bg-success/20 text-success' },
    { label: 'Overdue Tasks', value: 3, icon: <FiAlertCircle />, color: 'bg-error/20 text-error' },
  ];

  const recentActivity = [
    { message: 'You completed "Update user interface"', time: '2 hours ago', type: 'complete' },
    { message: 'Alex assigned you to "Fix navigation bug"', time: '5 hours ago', type: 'assign' },
    { message: 'New comment on "Database migration"', time: 'Yesterday', type: 'comment' },
    { message: 'You created project "Mobile App Redesign"', time: '2 days ago', type: 'create' },
  ];

  const upcomingDeadlines = [
    { task: 'Complete payment integration', project: 'E-commerce Platform', dueDate: 'Tomorrow' },
    { task: 'Design user onboarding flow', project: 'Mobile App Redesign', dueDate: 'In 2 days' },
    { task: 'API documentation update', project: 'Backend Services', dueDate: 'Next week' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-neutral-800">Dashboard</h1>
            <p className="text-neutral-600">Welcome back, let's get things done!</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link to="/dashboard/projects/new" className="btn-primary">
              New Project
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.label}
            className="card p-4 flex items-center"
            whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
          >
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="ml-4">
              <p className="text-sm text-neutral-600">{stat.label}</p>
              <h3 className="text-2xl font-bold text-neutral-800">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div 
          className="lg:col-span-2 card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-5 border-b border-neutral-200">
            <h2 className="font-display font-bold text-lg">Recent Activity</h2>
          </div>
          <div className="p-5 divide-y divide-neutral-200">
            {recentActivity.map((activity, index) => (
              <div key={index} className="py-3 flex">
                <div className="mr-4">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    activity.type === 'complete' ? 'bg-success/20 text-success' :
                    activity.type === 'assign' ? 'bg-accent/20 text-accent' :
                    activity.type === 'comment' ? 'bg-primary/20 text-primary' :
                    'bg-secondary/20 text-secondary'
                  }`}>
                    {activity.type === 'complete' ? <FiCheck /> :
                     activity.type === 'assign' ? <FiCalendar /> :
                     activity.type === 'comment' ? <FiList /> :
                     <FiGrid />}
                  </div>
                </div>
                <div>
                  <p className="text-neutral-800">{activity.message}</p>
                  <p className="text-sm text-neutral-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="p-5 border-b border-neutral-200 flex items-center">
            <FiCalendar className="text-primary mr-2" />
            <h2 className="font-display font-bold text-lg">Upcoming Deadlines</h2>
          </div>
          <div className="p-5 space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                <h3 className="font-medium text-neutral-800">{deadline.task}</h3>
                <p className="text-sm text-neutral-600">{deadline.project}</p>
                <div className="mt-2 flex items-center text-warning text-sm">
                  <FiClock className="mr-1" /> Due {deadline.dueDate}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
