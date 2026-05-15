# RescueLink

RescueLink is a MERN wildlife emergency coordination platform. Citizens can report animal incidents anonymously or with an account, AI triage analyzes the report, and verified rescuers receive city-scoped real-time notifications.

## Architecture

Client: React 18, Vite, Tailwind CSS, React Router, Socket.io client, Leaflet.

Server: Node.js, Express, MongoDB/Mongoose, JWT/bcrypt auth, OpenRouter vision analysis, Cloudinary config, Socket.io.

Flow: citizen report -> incident saved -> AI analysis attempted -> nearest verified rescuer matched -> city Socket.io room notified -> rescuer updates status forward only.

## Setup

```bash
npm install --prefix server
npm install --prefix client
```

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_key_min_32_chars
OPENROUTER_API_KEY=sk-or-...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=rescuelink_unsigned
VITE_SOCKET_URL=http://localhost:5000
```

Run locally:

```bash
npm run dev --prefix server
npm run dev --prefix client
```

Build client:

```bash
npm run build --prefix client
```

## Seed Data

No seed command is included yet. To test matching, create at least one rescuer user in MongoDB with `role: "rescuer"`, `verified: true`, `available: true`, a lowercase `city`, coordinates, and specialties.

## Deployment

Deploy `server/` to Render and `client/` to Vercel. Set the same env vars in each platform. Keep `OPENROUTER_API_KEY`, `JWT_SECRET`, and Cloudinary API secret server-side only.

## Notes

- Cloudinary unsigned upload preset should be scoped to the `rescuelink/` folder.
- OpenRouter failures do not block incident creation.
- Socket.io joins rescuers to their city room to avoid cross-city incident leakage.
