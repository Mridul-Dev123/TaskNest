import session from "express-session";
import passport from "./src/middleware/passport.middleware.js";
import userRouter from "./src/routes/user.routes.js";
import taskRouter from "./src/routes/task.routes.js";
import express from "express"
import cors from "cors";
import { ApiError } from "./src/utils/index.js";


import connectPgSimple from "connect-pg-simple";
const PgSession = connectPgSimple(session);
import pkg from "pg";
const { Pool } = pkg;


if (!process.env.SESSION_SECRET) {
    throw new Error("Missing SESSION_SECRET env var — set it and restart.");
}
if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL env var — set it and restart.");
}
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});



const app = express();

// Trust Railway's reverse proxy — required for secure cookies behind a proxy
app.set("trust proxy", 1);

const clientUrl = process.env.CLIENT_URL?.replace(/\/$/, "") || "http://localhost:5173";
console.log(`Server starting with NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`CORS allowing origin: ${clientUrl}`);

app.use(cors({
    origin: clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
    session({
        store: new PgSession({
            pool,
            tableName: "Session",
            errorLog: (err) => console.error("PgSession store error:", err),
        }),
        secret: process.env.SESSION_SECRET || "your-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        }
    })
)
app.use(passport.initialize());
app.use(passport.session());


app.get('/api', (req, res) => {
    return res.status(201).json({
        message: "TaskNest Api is Active",
        status: "active",
        timestamp: new Date()
    });
});
app.use('/api/auth', userRouter);
app.use('/api/tasks', taskRouter);

app.use((req, res, next) => {
    next(new ApiError(404, "Route not found"));
})

app.use((err, req, res, next) => {
    console.error(err.stack);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            ...(process.env.NODE_ENV === "development" && { stack: err.stack })
        });
    }

    console.log("final Error", err);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errors: [],
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
});




export default app;