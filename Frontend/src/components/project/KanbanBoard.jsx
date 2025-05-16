import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import TaskModal from './TaskModal';
import Button from '../ui/Button';
import { tasks } from '../../assets/mockData';
import { Plus } from 'lucide-react';

const KanbanBoard = () => {
  const [columns, setColumns] = useState(tasks);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [currentColumn, setCurrentColumn] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleAddTask = (column) => {
    setCurrentColumn(column);
    setIsAddTaskModalOpen(true);
  };
  
  const handleTaskCreated = (task) => {
    setColumns(prev => ({
      ...prev,
      [currentColumn]: [...prev[currentColumn], task]
    }));
  };
  
  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };
  
  const handleTaskClose = () => {
    setSelectedTask(null);
  };
  
  // Simulated drag and drop - in a real app, use react-beautiful-dnd or similar
  const handleDragStart = (e, task, fromColumn) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('fromColumn', fromColumn);
    setIsDragging(true);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e, toColumn) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const fromColumn = e.dataTransfer.getData('fromColumn');
    
    // Skip if dropped in the same column
    if (fromColumn === toColumn) {
      setIsDragging(false);
      return;
    }
    
    const task = columns[fromColumn].find((t) => t.id === taskId);
    if (!task) {
      setIsDragging(false);
      return;
    }
    
    // Remove from source column
    const sourceColumn = columns[fromColumn].filter((t) => t.id !== taskId);
    
    // Add to target column
    setColumns({
      ...columns,
      [fromColumn]: sourceColumn,
      [toColumn]: [...(columns[toColumn] || []), task]
    });
    
    setIsDragging(false);
  };
  
  const columnTitles = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done'
  };
  
  return (
    <div className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {Object.keys(columns).map((columnKey) => (
          <motion.div
            key={columnKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * Object.keys(columns).indexOf(columnKey) }}
            className="flex flex-col h-[calc(100vh-200px)] bg-[#1A1A1A] rounded-lg shadow-md border border-[#333333] overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, columnKey)}
          >
            <div className="p-4 border-b border-[#333333] bg-[#222222] flex justify-between items-center sticky top-0">
              <h3 className="font-medium text-white flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  columnKey === 'todo' ? 'bg-blue-500' :
                  columnKey === 'in-progress' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                {columnTitles[columnKey]}
                <span className="ml-2 bg-[#333333] text-white/70 text-xs px-2 py-0.5 rounded-full">
                  {columns[columnKey].length}
                </span>
              </h3>
              <Button
                variant="text"
                size="sm"
                onClick={() => handleAddTask(columnKey)}
                className="p-1 hover:bg-[#333333] rounded-full"
              >
                <Plus size={18} className="text-[#1DCD9F]" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {columns[columnKey].length === 0 ? (
                <div className="h-24 border-2 border-dashed border-[#333333] rounded-lg flex items-center justify-center text-white/50 text-sm">
                  Drop tasks here
                </div>
              ) : (
                columns[columnKey].map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => handleTaskClick(task)}
                    onDragStart={(e) => handleDragStart(e, task, columnKey)}
                    isDragging={isDragging}
                    index={index}
                  />
                ))
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      <AddTaskModal 
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onTaskCreated={handleTaskCreated}
        columnType={currentColumn}
      />
      
      {selectedTask && (
        <TaskModal
          isOpen={!!selectedTask}
          onClose={handleTaskClose}
          task={selectedTask}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
