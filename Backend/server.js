import express from "express";
import path from "path";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import connectDb from "./config/db.js";
import cors from "cors";
import axios from "axios";
import querystring from "querystring";
dotenv.config({ path: "./.env" });
const app = express();
//Database connection
connectDb();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

const port = process.env.PORT || 5000;

//middleware
app.use("/api/user", userRoutes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/Frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server is ready");
  });
}

//Google O Auth Starts
// Google OAuth
const redirectURI = "auth/google";

function getGoogleAuthURL() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: `${process.env.SERVER_URL}/${redirectURI}`,
    client_id: process.env.CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  return `${rootUrl}?${querystring.stringify(options)}`;
}

// Getting login URL
app.get("/auth/google/url", (req, res) => {
  res.send(getGoogleAuthURL());
});

async function getTokens({ code, clientId, clientSecret, redirectUri }) {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  };

  try {
    const response = await axios.post(url, querystring.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Failed to fetch auth tokens:`, error.message);
    throw new Error(error.message);
  }
}

// Getting the user from Google with the code
app.get(`/${redirectURI}`, async (req, res) => {
  const code = req.query.code;

  try {
    const { id_token, access_token } = await getTokens({
      code,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectUri: `${process.env.SERVER_URL}/${redirectURI}`,
    });

    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );

    console.log("Google User:", googleUser.data);
    res.send("Successfully authenticated with Google.");
  } catch (error) {
    console.error(`Failed to fetch user:`, error.message);
    res.status(500).send("Failed to fetch user information.");
  }
});
//Google O Auth Ends

app.use(errorHandler);
app.use(notFound);
app.listen(port, (req, res) => {
  console.log(`Listening at ${port}`);
});
