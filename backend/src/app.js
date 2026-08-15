import express from "express";
import cors from "cors";
import { json } from "express";
import supabase from "./db.js";
const app = express();
const port = Number(process.env.PORT ?? 3000);
app.use(cors({ origin: true }));
app.use(json({ limit: "10mb" }));
function normalizeVideo(payload) {
    if (!payload || typeof payload !== "object")
        return null;
    const item = payload;
    const id = typeof item.id === "string" ? item.id : undefined;
    const title = typeof item.title === "string" ? item.title : undefined;
    const description = typeof item.description === "string" ? item.description : undefined;
    const url = typeof item.url === "string" ? item.url : undefined;
    const thumbnail = typeof item.thumbnail === "string" ? item.thumbnail : undefined;
    const views = typeof item.views === "string" ? item.views : "0";
    const comments = typeof item.comments === "string" ? item.comments : "0";
    if (!id || !title || !description || !url)
        return null;
    return { id, title, description, url, thumbnail, views, comments };
}
function normalizeOwnerUser(payload) {
    if (!payload || typeof payload !== "object")
        return null;
    const item = payload;
    const username = typeof item.username === "string" ? item.username : undefined;
    const password = typeof item.password === "string" ? item.password : undefined;
    if (!username || !password)
        return null;
    return { username, password };
}
app.post("/owner-login", async (req, res) => {
    try {
        const body = req.body;
        const username = body?.username?.trim();
        const password = body?.password;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required." });
        }
        // Prefer Supabase-based owner authentication when configured
        if (supabase) {
            const { data, error } = await supabase
                .from("owner_users")
                .select("username,password")
                .eq("username", username)
                .maybeSingle();
            if (error) {
                console.error("Supabase owner login error", error);
                return res.status(500).json({ error: "Could not authenticate owner." });
            }
            if (!data || data.password !== password) {
                return res.status(401).json({ error: "Invalid credentials." });
            }
            return res.json({ success: true, username: data.username });
        }
        // Fallback to environment-configured owner credentials (useful for quick local setups).
        const envUser = process.env.OWNER_USERNAME;
        const envPass = process.env.OWNER_PASSWORD;
        if (envUser && envPass) {
            if (username === envUser && password === envPass) {
                return res.json({ success: true, username: envUser });
            }
            return res.status(401).json({ error: "Invalid credentials." });
        }
        return res.status(503).json({ error: "Authentication backend not configured." });
    }
    catch (error) {
        console.error("Owner login failed", error);
        return res.status(500).json({ error: "Could not authenticate owner." });
    }
});
app.get("/videos", async (_req, res) => {
    try {
        if (!supabase) {
            return res.status(503).json({ error: "Storage backend not configured." });
        }
        const { data, error } = await supabase.from("videos").select("*");
        if (error) {
            console.error("Supabase read videos error", error);
            return res.status(500).json({ error: "Could not load videos." });
        }
        const videos = Array.isArray(data)
            ? data
                .map(normalizeVideo)
                .filter((video) => video !== null)
            : [];
        return res.json(videos);
    }
    catch (error) {
        console.error("Videos endpoint failed", error);
        return res.status(500).json({ error: "Could not load videos." });
    }
});
app.post("/videos", async (req, res) => {
    try {
        if (!supabase) {
            return res.status(503).json({ error: "Storage backend not configured." });
        }
        const payload = req.body;
        if (!Array.isArray(payload)) {
            return res.status(400).json({ error: "Videos payload must be an array." });
        }
        const videos = payload
            .map(normalizeVideo)
            .filter((video) => video !== null);
        if (videos.length === 0) {
            return res.status(400).json({ error: "No valid videos provided." });
        }
        const { data, error } = await supabase.from("videos").upsert(videos, {
            onConflict: "id",
            ignoreDuplicates: false,
        });
        if (error) {
            console.error("Supabase save videos error", error);
            return res.status(500).json({ error: "Could not save videos." });
        }
        const savedVideos = Array.isArray(data)
            ? data
                .map(normalizeVideo)
                .filter((video) => video !== null)
            : [];
        return res.json(savedVideos);
    }
    catch (error) {
        console.error("Save videos failed", error);
        return res.status(500).json({ error: "Could not save videos." });
    }
});
app.post("/video-poster", async (req, res) => {
    try {
        const body = req.body;
        const dataUrl = body?.dataUrl;
        const videoId = body?.videoId || body?.reelId;
        if (!dataUrl || !videoId) {
            return res.status(400).json({ error: "Poster image and video ID are required." });
        }
        const match = dataUrl.match(/^data:(image\/(jpeg|jpg|png|webp));base64,(.+)$/);
        if (!match) {
            return res.status(400).json({ error: "Invalid poster image format." });
        }
        const contentType = match[1] === "image/jpg" ? "image/jpeg" : match[1];
        const extension = match[2] === "jpeg" ? "jpg" : match[2];
        const buffer = Buffer.from(match[3], "base64");
        if (!supabase) {
            return res.status(503).json({ error: "Storage backend not configured." });
        }
        const bucket = process.env.SUPABASE_POSTER_BUCKET ?? "posters";
        const filePath = `videos/${videoId}.${extension}`;
        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, buffer, { contentType, upsert: true });
        if (uploadError) {
            console.error("Supabase poster upload error", uploadError);
            return res.status(500).json({ error: "Could not upload poster image." });
        }
        const urlData = supabase.storage.from(bucket).getPublicUrl(filePath);
        if (!urlData.data?.publicUrl) {
            console.error("Supabase public url error", "Missing public URL");
            return res.status(500).json({ error: "Could not create poster URL." });
        }
        return res.json({ url: urlData.data.publicUrl });
    }
    catch (error) {
        console.error("Poster upload failed", error);
        return res.status(500).json({ error: "Could not upload poster image." });
    }
});
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
});
if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`Backend service listening on port ${port}`);
    });
}
export default app;
