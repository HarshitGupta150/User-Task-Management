const express = require('express');
const taskController = require('../controllers/taskController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, taskController.listTasks);
router.post('/', verifyToken, taskController.addTask);
router.put('/:taskId', verifyToken, taskController.editTask);
router.delete('/:taskId', verifyToken, taskController.deleteTask);
router.get('/:taskId/subTasks', verifyToken, taskController.listSubtasks);
router.put('/:taskId/subTasks', verifyToken, taskController.updateSubtasks);

module.exports = router;