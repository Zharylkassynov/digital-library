<div align="center">

# Digital Library

A modern full-stack digital library built with **React + Vite**, **Express**, and **SQLite**.

Browse resources, authenticate users, save favorites, manage books from an admin panel, upload cover images, receive user reports, and track resource visits with a clean analytics dashboard.

</div>

## Overview

Digital Library is a lightweight resource management platform designed for showcasing books and learning materials with a fast frontend and a minimal backend.

It includes:

- public browsing with search and filters
- JWT authentication with user and admin roles
- server-side favorites stored in SQLite
- admin CRUD for resources
- image upload for resource covers
- site-wide user reports
- view analytics with charts in the admin panel

## Features

### User side

- Browse books and resources
- Search by title
- Filter by category and type
- Open resource details in a modal
- Save favorites after login
- Register and log in
- Send a report from the home page

### Admin side

- Create, update, and delete resources
- Upload image files for resource covers
- See popular resources by views
- View a daily visits chart
- Read user-submitted reports

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Tailwind CSS
- Recharts
- Lucide React

### Backend

- Node.js
- Express
- SQLite (`sqlite3`)
- JWT (`jsonwebtoken`)
- Password hashing with `bcryptjs`
- File uploads with `multer`

## Project Structure

```text
digital library/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── favoritesController.js
│   │   ├── reportsController.js
│   │   ├── resourcesController.js
│   │   ├── statsController.js
│   │   └── uploadController.js
│   ├── database/
│   │   └── library.db
│   ├── images/
│   │   └── books/
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── requireAdmin.js
│   ├── models/
│   │   ├── favoriteModel.js
│   │   ├── reportModel.js
│   │   ├── resourceModel.js
│   │   ├── statsModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── favorites.js
│   │   ├── reports.js
│   │   ├── resources.js
│   │   ├── stats.js
│   │   └── upload.js
│   ├── seed/
│   ├── utils/
│   │   ├── tokens.js
│   │   └── validators.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── package.json
    └── src/
        ├── api/
        │   └── api.js
        ├── components/
        │   ├── AdminReportsScroll.jsx
        │   ├── AdminVisitsChart.jsx
        │   ├── ResourceGrid.jsx
        │   ├── ResourceModal.jsx
        │   └── SiteReportSection.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── hooks/
        │   └── useBookmarks.js
        ├── pages/
        │   ├── AdminPage.jsx
        │   ├── HomePage.jsx
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   └── SavedPage.jsx
        └── main.jsx
```

## Database

The app uses SQLite and creates tables automatically on startup.

### Main tables

- `resources` - library items
- `users` - registered users with roles
- `favorites` - saved resources by user
- `reports` - user messages and issue reports
- `resource_views` - total views per resource
- `view_events` - per-view event log for analytics charts

## Getting Started

### Requirements

- Node.js 18+
- npm

### 1. Backend setup

```bash
cd backend
npm install
```

Create a real env file:

```bash
copy .env.example .env
```

Then edit `backend/.env`:

```env
PORT=5000
JWT_SECRET=change-this-to-a-long-random-string
JWT_EXPIRES=7d
ADMIN_EMAIL=admin@gmail.com
```

Important:

- `ADMIN_EMAIL` must match the email of a real registered user
- that user becomes `admin`
- `.env.example` is only a template; the backend reads `.env`

Optional seed:

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

Default backend URL:

```text
http://localhost:5000
```

If port `5000` is busy, the backend may switch to `5001`.

### 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL:

```text
http://localhost:5173
```

If your backend is not running on port `5000`, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5001
```

## Admin Access

To open the admin panel:

1. Set `ADMIN_EMAIL` inside `backend/.env`
2. Restart the backend
3. Register or log in with the same email
4. Open `/admin` or use the `Admin` link in the header

If the role still shows as `user`, make sure:

- the backend is using `backend/.env`
- the email in `users` exactly matches `ADMIN_EMAIL`
- you restarted the backend after editing `.env`

## API Summary

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register user |
| `POST` | `/api/auth/login` | Public | Log in |
| `GET` | `/api/auth/me` | Bearer token | Current user |

### Resources

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/resources` | Public | List resources |
| `GET` | `/api/resources/random` | Public | Random resources |
| `GET` | `/api/resources/filters` | Public | Available categories and types |
| `GET` | `/api/resources/:id` | Public | Resource details |
| `POST` | `/api/resources/:id/view` | Public | Record a view |
| `POST` | `/api/resources` | Admin | Create resource |
| `PUT` | `/api/resources/:id` | Admin | Update resource |
| `DELETE` | `/api/resources/:id` | Admin | Delete resource |

### Favorites

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/favorites` | User | Get saved favorites |
| `POST` | `/api/favorites` | User | Add favorite |
| `DELETE` | `/api/favorites/:id` | User | Remove favorite |

### Reports

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/reports` | Public | Submit site report |
| `GET` | `/api/reports` | Admin | List reports |

Example site-wide report payload:

```json
{
  "message": "Search is not working on the home page."
}
```

### Uploads

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/upload/image` | Admin | Upload cover image file |

Request type:

```text
multipart/form-data
```

Field name:

```text
file
```

### Stats

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/stats` | Public | Popular resources by total views |
| `GET` | `/api/stats/timeline?days=30&resourceId=` | Admin | Daily visits chart data |

## What Happens to Reports?

Reports are stored in the SQLite table `reports`.

- Home page reports are saved as general site reports
- `resource_id` can be `NULL`
- Admin can read them from the admin panel

## Image Upload Flow

When an admin uploads a cover image:

1. the file is sent to `/api/upload/image`
2. the backend stores it in `backend/images/books/`
3. the API returns the saved filename
4. that filename is stored in the `image` field of the resource
5. the frontend displays it using `/images/books/<filename>`

## Manual Test Checklist

Use this quick flow after setup:

1. Register a normal user
2. Register or log in with `ADMIN_EMAIL`
3. Open the admin panel
4. Create a resource
5. Upload an image for that resource
6. Open the resource modal and verify the view counter changes
7. Check the visits chart in admin
8. Add and remove favorites
9. Submit a report from the home page
10. Confirm the report appears in admin

## Notes

- JWT is stored in `localStorage` under `digital-library-token`
- Guests can browse resources but cannot save favorites
- Cover uploads are restricted to image file types
- The admin visits chart uses `view_events`, so timeline data is collected from the moment event logging is enabled

## Future Improvements

- Edit and manage reports directly from admin
- Add pagination on the backend
- Add automated tests for API routes
- Improve search with more advanced matching

---

<div align="center">
Built for a simple, clean, and practical digital library experience.
</div>
