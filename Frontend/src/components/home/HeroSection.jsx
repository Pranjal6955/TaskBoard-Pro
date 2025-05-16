import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { ArrowRight, CheckCircle, BarChart, Users, Zap, PieChart } from 'lucide-react';

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const features = [
    'Intuitive Kanban boards',
    'Real-time collaboration',
    'Powerful automation',
    'Advanced reporting'
  ];

  const featuresDetailed = [
    {
      title: 'Intuitive Kanban Boards',
      description: 'Visualize your workflow with customizable boards that make project management simple and effective.',
      icon: <BarChart size={24} className="text-[#1DCD9F]" />
    },
    {
      title: 'Real-time Collaboration',
      description: 'Work together with your team in real-time with instant updates and seamless communication.',
      icon: <Users size={24} className="text-[#1DCD9F]" />
    },
    {
      title: 'Powerful Automation',
      description: 'Save time with automated workflows that handle repetitive tasks and keep your projects moving forward.',
      icon: <Zap size={24} className="text-[#1DCD9F]" />
    },
    {
      title: 'Advanced Reporting',
      description: 'Gain valuable insights with detailed reports and analytics to keep your projects on track.',
      icon: <PieChart size={24} className="text-[#1DCD9F]" />
    }
  ];

  return (
    <>
      <div className="min-h-screen pt-16 flex items-center relative overflow-hidden bg-[#000000]">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#111111] to-[#222222] z-0"></div>
        <div className="absolute top-40 left-20 w-72 h-72 rounded-full bg-[#1DCD9F]/20 filter blur-[80px] z-0"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-[#169976]/20 filter blur-[100px] z-0"></div>
        
        <div className="container mx-auto px-4 z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col space-y-6"
            >
              <motion.span variants={itemVariants} className="text-[#1DCD9F] font-semibold">
                Project Management Reimagined
              </motion.span>
              
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Collaborate and 
                <span className="text-[#1DCD9F]"> deliver</span> with TaskBoard Pro
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-lg text-white/70 max-w-lg">
                Streamline your workflow, increase productivity, and deliver projects on time with our powerful and intuitive project management platform.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
                <Link to="/login">
                  <Button variant="primary" size="lg" icon={<ArrowRight size={18} />}>
                    Get Started
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Watch Demo
                </Button>
              </motion.div>
              
              <motion.div variants={containerVariants} className="pt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                {features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    variants={itemVariants}
                    className="flex items-center"
                  >
                    <CheckCircle size={18} className="text-[#1DCD9F] mr-2" />
                    <span className="text-white/90">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 50, damping: 20, delay: 0.5 }}
              className="relative"
            >
              <div className="relative w-full h-[500px] p-4 bg-gradient-to-br from-[#222222] to-[#111111] rounded-lg border border-[#333333] shadow-xl overflow-hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute top-2 left-2 right-2 h-10 bg-[#1A1A1A] rounded flex items-center px-3"
                >
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </motion.div>
                
                <div className="mt-12 grid grid-cols-3 gap-4 h-[calc(100%-3rem)] overflow-y-auto p-2">
                  {["To Do", "In Progress", "Done"].map((column, colIndex) => (
                    <motion.div
                      key={column}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + colIndex * 0.2 }}
                      className="bg-[#1A1A1A] rounded p-3 h-full"
                    >
                      <h3 className="text-white/90 font-medium mb-3">{column}</h3>
                      
                      {[1, 2, 3].map((task, taskIndex) => (
                        <motion.div
                          key={`${column}-${task}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.5 + taskIndex * 0.1 + colIndex * 0.3 }}
                          whileHover={{ y: -5, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
                          className="bg-[#222222] p-3 rounded mb-2 border border-[#333333]"
                        >
                          <div className="text-white/90 font-medium text-sm mb-2">
                            Task {colIndex + 1}.{taskIndex + 1}
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="bg-[#1DCD9F]/20 text-[#1DCD9F] text-xs py-1 px-2 rounded">
                              Feature
                            </div>
                            <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-[#0A0A0A] relative">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#1DCD9F]/10 filter blur-[100px] z-0"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-[#169976]/10 filter blur-[100px] z-0"></div>
        
        <div className="container mx-auto px-4 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features for Your Projects</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              TaskBoard Pro comes packed with all the tools you need to manage your projects efficiently and effectively.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuresDetailed.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#1A1A1A] to-[#111111] p-6 rounded-lg border border-[#333333] hover:border-[#1DCD9F]/50 transition-all duration-300"
              >
                <div className="bg-[#1DCD9F]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex justify-center"
          >
            <Link to="/login">
              <Button variant="primary" size="lg">
                Explore All Features
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;