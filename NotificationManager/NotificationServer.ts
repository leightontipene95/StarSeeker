import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// JSONBin configuration from .env
// Remove escape characters that Expo needs but Node doesn't
const JSONBIN_URL = process.env.EXPO_PUBLIC_JSONBIN_URL;
const JSONBIN_KEY = process.env.EXPO_PUBLIC_JSONBIN_KEY?.replace(/\\/g, '');

if (!JSONBIN_URL || !JSONBIN_KEY) {
  console.error(
    "❌ Missing required environment variables: EXPO_PUBLIC_JSONBIN_URL or EXPO_PUBLIC_JSONBIN_KEY"
  );
  process.exit(1);
}

console.log("✅ Loaded config:");
console.log("   URL:", JSONBIN_URL);
console.log("   Key:", JSONBIN_KEY?.substring(0, 10) + "...");

interface ExpoToken {
  name: string;
  token: string;
}

interface NotificationPayload {
  to: string | string[];
  title: string;
  body: string;
  data?: any;
  sound?: string;
  badge?: number;
}

// Fetch Expo push tokens from JSONBin
async function getExpoTokens(): Promise<ExpoToken[]> {
  try {
    const response = await fetch(JSONBIN_URL!, {
      headers: {
        "X-Master-Key": JSONBIN_KEY!,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("JSONBin response:", response.status, errorText);
      throw new Error(`JSONBin error: ${response.statusText}`);
    }

    const data: any = await response.json();
    const travelers = data.record?.users || [];

    console.log(`🚀 Fetched ${travelers.length} traveler(s) from Mission Control`);
    travelers.forEach((traveler: ExpoToken, index: number) => {
      console.log(
        `   🧑‍🚀 Traveler ${index + 1}: ${traveler.name} - ${traveler.token.substring(0, 20)}...`
      );
    });

    return travelers;
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return [];
  }
}

// Send push notification via Expo
async function sendPushNotification(payload: NotificationPayload) {
  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}

// Routes
app.get("/tokens", async (req, res) => {
  try {
    const travelers = await getExpoTokens();
    res.json({ success: true, travelers, users: travelers }); // Keep 'users' for backward compatibility
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch travelers" });
  }
});

app.post("/send", async (req, res) => {
  try {
    const { title, body, target, data, sound, badge } = req.body;

    const travelers = await getExpoTokens();

    if (travelers.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "No travelers available for mission broadcast" });
    }

    let recipients: string[] = [];

    if (target === "all") {
      recipients = travelers.map((t) => t.token);
    } else if (target === "individual" && req.body.userIndex !== undefined) {
      recipients = [travelers[req.body.userIndex].token];
    } else {
      return res.status(400).json({ success: false, error: "Invalid target" });
    }

    const payload: NotificationPayload = {
      to: recipients.length === 1 ? recipients[0] : recipients,
      title,
      body,
      data,
      sound: sound || "default",
      badge: badge || 0,
    };

    const result = await sendPushNotification(payload);
    console.log(`🚀 Mission broadcast sent: "${title}" to ${recipients.length} traveler(s)`);
    res.json({ success: true, result });
  } catch (error) {
    console.error("❌ Mission broadcast failed:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to send mission broadcast" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "NotificationClient.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Notification Manager running at http://localhost:${PORT}`);
});
