const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server);

const userRoutes = require('./routes/user');
const restaurantRoutes = require('./routes/restaurant');
const orderRoutes = require('./routes/order');

// Default route for '/'
app.get('/', (req, res) => {
  res.send('Server is running and root route is working!');
});

app.use('/api', userRoutes);
app.use('/api', restaurantRoutes);
app.use('/api', orderRoutes);

// WebSocket connection for real-time order tracking
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('order-status', (orderId) => {
    // Simulate real-time order status updates
    setTimeout(() => {
      io.emit(`order-${orderId}-status`, 'Confirmed');
    }, 3000);
    setTimeout(() => {
      io.emit(`order-${orderId}-status`, 'Out for Delivery');
    }, 5000);
  });
});

// Connect to MongoDB and start server
mongoose.connect("mongodb+srv://skyasar210:TkYR5yclmwdC3UFF@cluster0.6ipy4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    server.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });
