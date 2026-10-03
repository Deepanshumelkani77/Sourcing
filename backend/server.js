const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const connectDB = require("./config/db");
const userAuthRoutes = require("./routes/userAuthRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const productRoutes = require("./routes/productRoutes");
const containerRoutes = require("./routes/containerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const issueRoutes = require("./routes/issueRoutes");
const jobRoutes = require("./routes/jobRoutes");
const passport = require("./config/passport");
const { googleCallback, facebookCallback } = require("./controllers/userAuthController");

dotenv.config();

const app = express();


/*
|--------------------------------------------------------------------------
| Database
|--------------------------------------------------------------------------
*/

connectDB();


/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({
  extended: true,
}));

app.use(cookieParser());

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(passport.initialize());


/*
|--------------------------------------------------------------------------
| Health check
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "IndoChinaBridge API is running",
  });
});


/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.use(
  "/api/user/auth",
  userAuthRoutes
);

console.log("User auth routes mounted at /api/user/auth");

app.use(
  "/api/admin/auth",
  adminAuthRoutes
);

// Legacy Google OAuth routes for backward compatibility
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  googleCallback
);

// Legacy Facebook OAuth routes for backward compatibility
app.get(
  "/api/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"], session: false })
);

app.get(
  "/api/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login", session: false }),
  facebookCallback
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/containers",
  containerRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/issues",
  issueRoutes
);

app.use(
  "/api/jobs",
  jobRoutes
);


/*
|--------------------------------------------------------------------------
| Error handler
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});


/*
|--------------------------------------------------------------------------
| Server
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});
