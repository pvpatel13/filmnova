const express = require("express");
const axios = require("axios");

const router = express.Router();

// Helper to fetch and map OMDb results
const fetchOmdb = async (query, year = "") => {
    const url = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${query}${year ? `&y=${year}` : ""}`;
    const response = await axios.get(url);
    return response.data.Search || [];
};

router.get("/search", async (req, res) => {
    try {
        const query = req.query.q;
        const response = await axios.get(
            `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${query}`
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching movies" });
    }
});

router.get("/details/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const response = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching movie details" });
    }
});

// OMDb simulated endpoints
router.get("/now_playing", async (req, res) => {
    try {
        const movies = await fetchOmdb("2024", "2024");
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching latest releases" });
    }
});

router.get("/popular", async (req, res) => {
    try {
        const movies = await fetchOmdb("Marvel");
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching popular movies" });
    }
});

router.get("/top_rated", async (req, res) => {
    try {
        const movies = await fetchOmdb("Batman");
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching top rated movies" });
    }
});

router.get("/genres", async (req, res) => {
    const genres = [
        { id: "Action", name: "Action" },
        { id: "Comedy", name: "Comedy" },
        { id: "Drama", name: "Drama" },
        { id: "Horror", name: "Horror" },
        { id: "Sci-Fi", name: "Sci-Fi" },
        { id: "Thriller", name: "Thriller" },
        { id: "Animation", name: "Animation" }
    ];
    res.json(genres);
});

router.get("/discover", async (req, res) => {
    try {
        const genre = req.query.genreId;
        const movies = await fetchOmdb(genre);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: "Error discovering movies" });
    }
});

router.get("/similar/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const details = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${id}`);
        const title = details.data.Title || "Action";
        const firstWord = title.split(" ")[0];
        const movies = await fetchOmdb(firstWord);
        res.json(movies.filter(m => m.imdbID !== id));
    } catch (error) {
        res.status(500).json({ message: "Error fetching similar movies" });
    }
});

module.exports = router;

