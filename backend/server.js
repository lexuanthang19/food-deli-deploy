import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import branchRouter from "./routes/branchRoute.js";
import tableRouter from "./routes/tableRoute.js";
import analyticsRouter from "./routes/analyticsRoute.js";
import userModel from "./models/userModel.js";
import bcrypt from "bcrypt";

// app config
const app = express();
const port = process.env.PORT || 4000;

// Create HTTP server and Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Export io for use in controllers
export { io };

// middlewares
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a branch room (for staff)
  socket.on("join_branch", (branchId) => {
    socket.join(`branch_${branchId}`);
    console.log(`Socket ${socket.id} joined branch_${branchId}`);
  });

  // Join a user room (for customer order tracking)
  socket.on("join_user", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Socket ${socket.id} joined user_${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/branch", branchRouter);
app.use("/api/table", tableRouter);
app.use("/api/analytics", analyticsRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

// Use server.listen instead of app.listen
// --- KHU VỰC CỨU HỘ ADMIN ---
app.get("/tao-admin-gap", async (req, res) => {
    try {
        // 1. Tạo mật khẩu mã hóa
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("123456", salt);
        
        // 2. Tạo Admin mới
        // Lưu ý: Code mới này có thể yêu cầu trường 'role' là 'admin'
        const newAdmin = new userModel({
            name: "Admin Rescue",
            email: "admin_vip@gmail.com",
            password: hashedPassword,
            role: "admin" 
        });

        await newAdmin.save();
        res.send("<h1>✅ ĐÃ TẠO ADMIN THÀNH CÔNG!</h1><p>Email: admin_vip@gmail.com</p><p>Pass: 123456</p>");
    } catch (error) {
        // Nếu lỗi trùng Email thì báo luôn
        res.send("<h1>❌ LỖI: " + error.message + "</h1>");
    }
});
// ---------------------------
server.listen(port, () => {
  console.log(`Server Started on port: ${port}`);
});

