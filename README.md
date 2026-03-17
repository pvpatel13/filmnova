# FilmNova - Movie Rating & Recommendation Platform

FilmNova is a modern, full-stack web application designed for Gen-Z users and cinephiles. It features a stunning dark-theme UI with glassmorphism effects and smooth GSAP animations.

## Tech Stack
- **Frontend**: React.js, React Bootstrap, GSAP, Axios, React Icons
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB with Mongoose
- **API**: OMDb API for movie data

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB running locally (default: `mongodb://localhost:27017/filmnova`)
- OMDb API Key (Get one at [omdbapi.com](http://www.omdbapi.com/apikey.aspx))

### Installation

1. **Clone the project** (or navigate to the directory)

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   - Update `.env` with your `OMDB_API_KEY`.

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Running the Project

1. **Start Backend** (from /backend folder)
   ```bash
   npm run dev
   ```
   *Note: I've added a "start" script in package.json to run with nodemon.*

2. **Start Frontend** (from /frontend folder)
   ```bash
   npm start
   ```

The application should now be running at `http://localhost:3000`.

## Features
- **Cinematic Hero Section**: Stunning reveal animation using GSAP.
- **Movie Discovery**: Search and explore thousands of movies via OMDb.
- **Rating & Reviews**: Share your thoughts and see what the community says.
- **Glassmorphism UI**: Premium visual experience with modern aesthetics.
- **Personalized Watchlist**: Save movies to your profile for later.
