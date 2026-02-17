import {ApiError, ApiResponse, asyncHandler} from "../utils/index.js";
import db from "../database/queries.js";
import passport from "../middleware/passport.middleware.js";
import bcrypt from "bcrypt";

/**
 * Sign up a new user
 * @route POST /api/users/signup
 * @access Public
 */
const signUp = asyncHandler(async (req, res, next) => {
  const { username, password, name } = req.body;

  // Validate required fields
  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }

  // Check if username already exists
  const existingUser = await db.searchByusername(username);
  if (existingUser) {
    throw new ApiError(409, "Username already exists");
  }

  // Hash password
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create new user
  const newUser = await db.createUser({ username, password: hashedPassword, name });

  // Remove password from response
  const {password: _, ...userWithoutPassword} = newUser;

  // Auto-login after signup
  req.login(newUser, (err) => {
    if (err) {
      return next(err);
    }
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          userWithoutPassword,
          "User registered successfully"
        )
      );
  });
});

/**
 * Login user
 * @route POST /api/users/login
 * @access Public
 */
const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // Validate required fields
  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }

  // Use passport to authenticate
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new ApiError(401, info?.message || "Invalid credentials"));
    }

    // Log the user in
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return res
        .status(200)
        .json(new ApiResponse(200, userWithoutPassword, "Login successful"));
    });
  })(req, res, next);
});

/**
 * Get all users
 * @route GET /api/users/getUsers
 * @access Private
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await db.getAllUsers();

  return res
    .status(200)
    .json(
      new ApiResponse(200, users, `Retrieved ${users.length} users successfully`)
    );
});

/**
 * Get current user info
 * @route GET /api/users/me
 * @access Private
 */
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by passport after authentication
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  // Fetch fresh user data
  const user = await db.getUser(req.user.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User data retrieved successfully"));
});

/**
 * Logout user
 * @route GET /api/users/logout
 * @access Private
 */
const logout = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }

      res.clearCookie("connect.sid"); // Clear session cookie
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Logout successful"));
    });
  });
});

const userController = { signUp, login, getUsers, getMe, logout };

export default userController;