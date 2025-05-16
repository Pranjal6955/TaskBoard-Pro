import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { PlusCircle, MoreVertical } from "lucide-react";
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import { createTask, moveTask, updateTask } from '../../services/taskService';

const KanbanBoard = ({ projectId, initialTasks = [] }) => {
  const [columns, setColumns] = useState({
    'todo': {
      id: 'todo',
      title: 'To Do',
      tasks: []
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      tasks: []
    },
    'done': {
      id: 'done',
      title: 'Done',
      tasks: []
    }
  });

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Organize tasks into columns
  useEffect(() => {
    if (initialTasks && initialTasks.length > 0) {
      const tasksByStatus = {
        'todo': [],
        'in-progress': [],
        'done': []
      };
      
      initialTasks.forEach(task => {
        const status = task.status || 'todo';
        if (tasksByStatus[status]) {
          tasksByStatus[status].push(task);
        } else {
          tasksByStatus['todo'].push(task);
        }
      });
      
      setColumns({
        'todo': {
          id: 'todo',
          title: 'To Do',
          tasks: tasksByStatus['todo'] || []
        },
        'in-progress': {
          id: 'in-progress',
          title: 'In Progress',
          tasks: tasksByStatus['in-progress'] || []
        },
        'done': {
          id: 'done',
          title: 'Done',
          tasks: tasksByStatus['done'] || []
        }
      });
    }
  }, [initialTasks]);
  
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    
    // Drop outside a droppable area
    if (!destination) return;
    
    // Drop in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;
    
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    
    // Move within the same column
    if (sourceColumn === destColumn) {
      const newTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedTask);
      
      const newColumn = {
        ...sourceColumn,
        tasks: newTasks
      };
      
      setColumns({
        ...columns,
        [newColumn.id]: newColumn
      });
      
      // No need to update the backend as the status hasn't changed
      return;
    }
    
    // Move to a different column
    // Update locally first for responsive UI
    const sourceTasks = Array.from(sourceColumn.tasks);
    const [movedTask] = sourceTasks.splice(source.index, 1);
    
    const destTasks = Array.from(destColumn.tasks);
    destTasks.splice(destination.index, 0, movedTask);
    
    setColumns({
      ...columns,
      [sourceColumn.id]: {
        ...sourceColumn,
        tasks: sourceTasks
      },
      [destColumn.id]: {
        ...destColumn,
        tasks: destTasks
      }
    });
    
    // Update the task status in the backend
    try {
      setIsLoading(true);
      await moveTask(movedTask._id || movedTask.id, destination.droppableId);
      setError(null);
    } catch (err) {
      console.error('Error moving task:', err);
      setError('Failed to update task position. Please refresh and try again.');
      
      // Revert the UI change on error
      setColumns({
        ...columns,
        [sourceColumn.id]: sourceColumn,
        [destColumn.id]: destColumn
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddTask = async (taskData) => {
    try {
      setIsLoading(true);
      const newTask = await createTask({
        ...taskData,
        projectId,
        status: activeColumn
      });
      
      // Update the UI
      const column = columns[activeColumn];
      const updatedColumn = {
        ...column,
        tasks: [newTask, ...column.tasks]
      };
      
      setColumns({
        ...columns,
        [activeColumn]: updatedColumn
      });
      
      setIsAddTaskModalOpen(false);
      setError(null);
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTaskUpdate = async (taskId, taskData) => {
    try {
      setIsLoading(true);
      const updatedTask = await updateTask(taskId, taskData);
      
      // Update the task in the correct column
      const columnId = updatedTask.status;
      const column = columns[columnId];
      
      if (column) {
        const taskIndex = column.tasks.findIndex(task => (task._id || task.id) === taskId);
        
        if (taskIndex !== -1) {
          const updatedTasks = [...column.tasks];
          updatedTasks[taskIndex] = updatedTask;
          
          setColumns({
            ...columns,
            [columnId]: {
              ...column,
              tasks: updatedTasks
            }
          });
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const openAddTaskModal = (columnId) => {
    setActiveColumn(columnId);
    setIsAddTaskModalOpen(true);
  };

  return (
    <>
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-red-200 text-sm">
          {error}
        </div>
      )}
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="bg-[#222222] rounded-lg p-4 min-h-[50vh]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">{column.title}</h3>
                <div className="flex items-center">
                  <button 
                    onClick={() => openAddTaskModal(column.id)}
                    className="text-[#1DCD9F] hover:text-[#19B589] p-1"
                    title={`Add task to ${column.title}`}
                  >
                    <PlusCircle size={18} />
                  </button>
                  <button className="text-white/70 hover:text-white p-1">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] transition-colors duration-200 ${
                      snapshot.isDraggingOver ? 'bg-[#1A1A1A]/50' : ''
                    }`}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable 
                        key={task._id || task.id} 
                        draggableId={task._id || task.id} 
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? '0.8' : '1'
                            }}
                            className="mb-3"
                          >
                            <TaskCard 
                              task={task} 
                              onTaskUpdate={handleTaskUpdate}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {column.tasks.length === 0 && !snapshot.isDraggingOver && (
                      <div className="text-white/50 text-center py-4 border border-dashed border-[#333333] rounded-md">
                        No tasks yet
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
              
              <button
                onClick={() => openAddTaskModal(column.id)}
                className="w-full mt-3 py-2 text-white/70 hover:text-white border border-dashed border-[#333333] rounded-md flex items-center justify-center"
              >
                <PlusCircle size={16} className="mr-2" />
                Add Task
              </button>
            </div>
          ))}
        </div>
      </DragDropContext>
      
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onTaskCreated={handleAddTask}
        columnType={activeColumn}
        isLoading={isLoading}
      />
    </>
  );
};

export default KanbanBoard;
