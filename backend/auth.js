// auth.js  (REPLACE CONTENTS)
import admin from "./firebase.js";

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    // decoded contains { uid, email, email_verified, ... }
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Firebase token error:", err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
