
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.YOUTUBE_API_KEY;

app.get("/api/search", async (req, res) => {
    try {
        const query = req.query.q;

        if (!query) {
            return res.status(400).json({
                error: "اكتب اسم الفيديو أولاً"
            });
        }

        if (!API_KEY) {
            return res.status(500).json({
                error: "مفتاح YouTube API غير موجود"
            });
        }

        const url = new URL(
            "https://www.googleapis.com/youtube/v3/search"
        );

        url.search = new URLSearchParams({
            part: "snippet",
            q: query,
            type: "video",
            maxResults: "10",
            key: API_KEY
        });

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "حدث خطأ أثناء البحث"
        });
    }
});

app.listen(3000, () => {
    console.log("MiniTube server running on port 3000");
});
