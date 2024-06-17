const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const port = process.env.PORT || 3000;

connectDB();

const app = express();

app.use(express.json());

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
