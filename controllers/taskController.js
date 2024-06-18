const User = require('../models/userModel');

/**
 * Retrieves all tasks for the authenticated user, filtering out deleted tasks and subtasks.
 * @param {object} req - Request object from express.
 * @param {object} res - Response object from express.
 * @returns {Promise} - Resolves with an json object with all non-deleted task in the database or rejects with an error
 * message if there is an error.
*/
const listTasks = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: `User not found` });
    }

    // Filter out deleted tasks and subtasks
    const filteredTasks = user.tasks.map(task => {
      const filteredSubtasks = task.subtasks.filter(subtask => !subtask.deleted);
      return { ...task.toObject(), subtasks: filteredSubtasks };
    }).filter(task => !task.deleted);

    return res.status(200).json({ tasks: filteredTasks });
  } catch (error) {
    console.error('Error fetching data from DB:', error);
    return res.status(500).json({ message: 'Failed to fetch tasks' });
  }
}

/**
 * Adds a new task for the authenticated user.
 * @param {object} req - Request object from express.
 * @param {object} res - Response object from express.
 * @returns {Promise} - Resolves with an json object with the newly added task in the database or rejects with an error
 * message if there is an error.
*/
const addTask = async (req, res) => {
  const { subject, deadline, status, subtasks } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new task object
    const newTask = {
      subject,
      deadline: new Date(deadline),
      status,
      subtasks
    };

    // Add the new task to the user's tasks array
    user.tasks.push(newTask);

    // Save the updated user data
    await user.save();

    return res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ message: 'Failed to create task' });
  }
}

/**
 * Updates an existing task for the authenticated user.
 * @param {object} req - Request object from express.
 * @param {object} res - Response object from express.
 * @returns {Promise} - Resolves with an json object with the specific edited task in the database or rejects with an error
 * message if there is an error.
 */
const editTask = async (req, res) => {
  const { taskId } = req.params;
  const { subject, deadline, status } = req.body;

  try {
    // Find the user by userId
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the task to update by taskId
    const taskToUpdate = user.tasks.filter(task => task._id.toString() === taskId);
    if (!taskToUpdate.length) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update task properties
    taskToUpdate[0].subject = subject || taskToUpdate[0].subject;
    taskToUpdate[0].deadline = deadline || taskToUpdate[0].deadline;
    taskToUpdate[0].status = status || taskToUpdate[0].status;

    // Save the updated user document
    await user.save();

    // Return the updated task object
    return res.status(200).json(taskToUpdate);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ message: 'Failed to update task' });
  }
}

/**
 * Marks a task as deleted for the authenticated user.
 * @param {object} req - Request object from express.
 * @param {object} res - Response object from express.
 * @returns {Promise} - Resolves with an json object with marking task as delted in the database or rejects with an error
 * message if there is an error.
 */
const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    // Find the user by userId
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the task to delete by taskId
    const taskToDelete = user.tasks.filter(task => task._id.toString() === taskId);
    if (!taskToDelete.length) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if(taskToDelete[0].deleted){
      return res.status(200).json({ message: 'Task is already deleted' });
    }

    // Mark the task as deleted
    taskToDelete[0].deleted = true;

    // Save the updated user document
    await user.save();

    // Return success message or any relevant response
    return res.status(200).json({ message: 'Task marked as deleted successfully' });
  } catch (error) {
    console.error('Error marking task as deleted:', error);
    return res.status(500).json({ message: 'Failed to mark task as deleted' });
  }
}

/**
 * Retrieves non-deleted subtasks for a specific task of the authenticated user.
 * @param {object} req - Request object from express.
 * @param {object} res - Response object from express.
 * @returns {Promise} - Resolves with an json object all non-deleted subtasks in the database or rejects with an error
 * message if there is an error.
 */
const listSubtasks = async (req, res) => {
  const { taskId } = req.params;

  try {
    // Find the user by userId
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the task by taskId
    const task = user.tasks.filter(task => task._id.toString() === taskId);
    if (!task.length) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Filter non-deleted subtasks
    const filteredSubtasks = task[0].subtasks.filter(subtask => !subtask.deleted);

    // Return non-deleted subtasks
    return res.status(200).json({ subTasks: filteredSubtasks });
  } catch (error) {
    console.error('Error retrieving subtasks:', error);
    return res.status(500).json({ error: 'Failed to retrieve subtasks' });
  }
}

/**
 * Updates subtasks for a specific task of the authenticated user.
 * @param {object} req - Request object from express.
 * @param {object} res - Response object from express.
  * @returns {Promise} - Resolves with an json object withthe updated subtasks in the database or rejects with an error
 * message if there is an error.
 */
const updateSubtasks = async (req, res) => {
  const { taskId } = req.params;
  const updatedSubtasks = req.body.subtasks; // Assuming req.body.subtasks contains the updated subtasks array

  try {
    // Find the user by userId
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the task by taskId
    const task = user.tasks.filter(task => task._id.toString() === taskId);
    if (!task.length) {
      return res.status(404).json({ error: 'Task not found' });
    }

    updatedSubtasks.forEach(updatedSubtask => {
      const existingSubtask = task[0].subtasks.find(subtask => subtask.subject === updatedSubtask.subject && !subtask.deleted);
      if (existingSubtask) {
        existingSubtask.deadline = updatedSubtask.deadline || existingSubtask.deadline;
        existingSubtask.status = updatedSubtask.status || existingSubtask.status;
        existingSubtask.deleted = updatedSubtask.deleted || existingSubtask.deleted;
      } else {
        task[0].subtasks.push({ ...updatedSubtask });
      }
    });

    // Save the updated user document
    await user.save();

    // Return the updated list of subtasks for the task
    return res.status(200).json({ subtasks: task[0].subtasks.filter(subtask => !subtask.deleted) });
  } catch (error) {
    console.error('Error updating subtasks:', error);
    return res.status(500).json({ error: 'Failed to update subtasks' });
  }
}

module.exports = {
  listTasks,
  addTask,
  editTask,
  deleteTask,
  listSubtasks,
  updateSubtasks,
}