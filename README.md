# India Tourism Explorer

A modern full-stack tourism web application scaffold for exploring India. This initial version includes the project structure, homepage, theme toggle, reusable React components, API integration setup, and an Express/MongoDB backend foundation.

## Tech Stack

- React.js with Vite
- Tailwind CSS
- React Router
- Node.js + Express
- MongoDB Atlas with Mongoose
- Axios
- Leaflet.js

## Project Structure

```text
india-tourism-explorer/
  frontend/
    src/
      assets/
      components/
      context/
      pages/
      routes/
      services/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
```

## Installation

1. Install root helper dependencies:

```bash
npm install
```

2. Install frontend and backend dependencies:

```bash
npm run install:all
```

3. Create environment files:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

PowerShell:

```powershell
Copy-Item frontend/.env.example frontend/.env
Copy-Item backend/.env.example backend/.env
```

4. Update `backend/.env` with your MongoDB Atlas connection string.

Also set a JWT secret:

```text
JWT_SECRET=replace_with_a_long_random_secret
```

5. Optional: add an OpenWeather API key to `backend/.env` for branded weather icons. If you skip this, the app uses the free Open-Meteo API automatically:

```text
OPENWEATHER_API_KEY=
```

6. Create `frontend/.env` (or copy from `frontend/.env.example`). Development uses `/api`, which Vite proxies to the backend on port 5000.

7. Optional: add an OpenTripMap API key to `frontend/.env` if you want to use OpenTripMap places. Without a key, the app uses Wikimedia's free no-key geosearch API.

```text
VITE_OPENTRIPMAP_API_KEY=
```

8. Run both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Backend API

Base URL:

```text
http://localhost:5000/api
```

Routes:

- `GET /health` - health check
- `GET /test/status` - API test status
- `GET /test/db` - MongoDB connection status
- `POST /auth/register` - register and receive an httpOnly JWT cookie
- `POST /auth/login` - login and receive an httpOnly JWT cookie
- `POST /auth/logout` - clear auth cookie
- `GET /auth/me` - current user profile, protected
- `PUT /auth/me` - update current user profile, protected
- `GET /hotels/nearby?lat=28.6139&lon=77.2090` - nearby hotels from OpenStreetMap data
- `/places` - place CRUD routes
- `GET /weather/current?lat=28.6139&lon=77.2090` - current OpenWeather conditions
- `/trips` - trip CRUD routes
- `/users` - user CRUD routes

JWTs are stored in httpOnly cookies, not localStorage.

## Available Scripts

- `npm run dev` - run frontend and backend together
- `npm run dev:frontend` - run only the Vite app
- `npm run dev:backend` - run only the Express API
- `npm run install:all` - install dependencies in both app folders
