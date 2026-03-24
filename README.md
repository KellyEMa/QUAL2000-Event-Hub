# Event Hub

## Project Overview

Event Hub is a simple CRUD web application built for a web programming course project. It keeps the same teaching-friendly structure as the current MoviePlex app, but changes the context to events and registrations.

The application has two sides inside the same Express app:

- A public client side where users can browse events and manage registrations
- A secured admin dashboard where an administrator can add, update, and delete event data

This project must remain simple, server-rendered, and beginner-friendly.

## Core Requirements

- Use `npm` as the package manager
- Use `server.js` as the main entry file
- Use CommonJS syntax with `require(...)`
- Use `express`, `mongoose`, `ejs`, and `dotenv` as the main dependencies
- Use MongoDB Atlas as the database
- Store all secrets in `.env`
- Commit a `.env.example` file with placeholder values only
- Use Git and GitHub for version control
- Use port `3000`
- Keep the project server-rendered with EJS

Optional but recommended:

- `method-override` for edit and delete form actions
- Bootstrap for simple styling

## Application Goal

The Event Hub app should allow users to:

- View all available events
- View the details of a single event
- Create a registration for an event
- View registrations belonging to the single client user
- Delete a registration

The admin dashboard should allow an authenticated admin to:

- View all events
- Add a new event
- Edit an existing event
- Delete an event

## Tech Stack

- Node.js
- Express
- Mongoose
- EJS
- dotenv
- MongoDB Atlas
- npm

## Required Project Structure

```text
.
|-- .env
|-- .env.example
|-- .gitignore
|-- README.md
|-- package.json
|-- package-lock.json
|-- server.js
|-- models/
|-- public/
`-- views/
    `-- partials/
```

Rules:

- Keep all route handlers in `server.js`
- Keep Mongoose schemas and models in `models/`
- Keep static files in `public/`
- Keep page templates in `views/`
- Keep reusable EJS parts in `views/partials/`
- Do not introduce a separate controller or service layer for this version

## Environment Variables

Use the following environment variables:

```env
DB_URI=your_mongodb_atlas_connection_string
PORT=3000
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
SESSION_SECRET=your_session_secret
```

Notes:

- `.env` must never be committed
- `.env.example` must contain placeholder values
- `PORT` should default to `3000`
- `DB_URI` must point to MongoDB Atlas

## server.js Rules

`server.js` must follow this order:

1. Import dependencies and models
2. Load environment variables with `require("dotenv").config();`
3. Create the Express app with `const server = express();`
4. Define `port` and `dbURI`
5. Configure view engine and middleware
6. Connect to MongoDB
7. Define public routes
8. Define secured admin routes
9. Define the catch-all 404 route

Expected setup pattern:

```js
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const server = express();
const port = process.env.PORT || 3000;
const dbURI = process.env.DB_URI;

server.set("view engine", "ejs");
server.use(express.static("public"));
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

mongoose
  .connect(dbURI)
  .then(() =>
    server.listen(port, () => {
      console.log(`Listening on port ${port}`);
    })
  )
  .catch((error) => console.log(error));

// public routes
// admin routes
// 404 route
```

Important rule:

- `mongoose.connect(...)` must come directly after the middleware setup and before the route definitions

## Route Style Rules

- Keep route handlers directly in `server.js`
- Use `request` and `response` as route callback parameter names
- Keep comments simple and descriptive
- Keep the CRUD routes easy for students to read
- Use redirects after create, update, and delete operations when appropriate

Example:

```js
server.get("/events", async (request, response) => {
  const events = await Event.find();
  response.render("eventsIndexPage", { events });
});
```

## Data Models

### Event

The main content model is `Event`.

Recommended fields:

- `title` as `String`
- `date` as `String` or `Date`
- `location` as `String`
- `category` as `String`
- `image` as `String`
- `description` as `String`
- `availableSlots` as `Number`

### Registration

The secondary model is `Registration`.

Recommended fields:

- `eventId` as `ObjectId` referencing `Event`
- `eventTitle` as `String`
- `attendeeName` as `String`
- `attendeeEmail` as `String`
- `ticketCount` as `Number`
- `status` as `String`

Suggested status values:

- `Confirmed`
- `Cancelled`

## Public Client-Side Features

The client side is for one logical user only. This project should not become a full multi-user platform.

Public users should be able to:

- View all events
- View one event
- Create a registration
- View their registration list
- Delete a registration

Recommended public routes:

- `GET /events`
- `GET /events/:id`
- `GET /events/registrations/:id`
- `POST /events/registrations`
- `GET /events/registrations`
- `DELETE /events/registrations/:id`

For course simplicity:

- Do not build a full social network or follower system
- Do not add likes, messaging, feeds, or multi-user ownership logic
- Keep the client side focused on event discovery and registration CRUD

## Secured Admin Dashboard

The admin area must be secured and separated from the public side.

Recommended admin routes:

- `GET /admin/login`
- `POST /admin/login`
- `POST /admin/logout`
- `GET /admin/events`
- `GET /admin/events/new`
- `POST /admin/events`
- `GET /admin/events/:id/edit`
- `PATCH /admin/events/:id`
- `DELETE /admin/events/:id`

Recommended security approach:

- Use simple session-based authentication
- Store admin credentials and session secret in `.env`
- Protect all `/admin` routes except the login page
- Redirect unauthenticated users away from the admin dashboard

Keep the security approach course-appropriate and easy to explain.

## Views And Naming Rules

All page views must end with `Page.ejs`.

Examples:

- `eventsIndexPage.ejs`
- `eventShowPage.ejs`
- `registrationsIndexPage.ejs`
- `registrationNewPage.ejs`
- `adminLoginPage.ejs`
- `adminEventsIndexPage.ejs`
- `adminEventsNewPage.ejs`
- `adminEventsEditPage.ejs`
- `notFoundPage.ejs`

Reusable shared markup should stay in `views/partials/`.

## Suggested Pages

Public side:

- Home page
- Events index page
- Single event page
- Registration form page
- Registrations list page

Admin side:

- Admin login page
- Admin events index page
- Admin new event page
- Admin edit event page

Shared:

- Navigation partial
- 404 page

## Coding Conventions

- Use semicolons
- Use clear variable names based on the domain
- Keep one model per file
- Use `const Schema = mongoose.Schema;`
- Export models with `module.exports = ModelName;`
- Prefer simple `async` and `await`
- Keep the code readable for web programming students

Do not introduce:

- TypeScript
- React, Vue, Angular, or another SPA framework
- An API-only backend
- A different package manager
- A different main file name
- `req` and `res` as handler parameter names

## Example package.json Expectations

The project should include:

- `"main": "server.js"`
- a start script such as `"start": "node server.js"`
- the required dependencies

## Minimum Completion Checklist

Before the project is considered complete, confirm that it includes:

- `server.js` as the entrypoint
- `npm` as the package manager
- `.env` and `.env.example`
- `express`, `mongoose`, `ejs`, and `dotenv`
- MongoDB Atlas connection through `DB_URI`
- `PORT=3000`
- middleware setup before the database connection
- database connection before routes
- `request` and `response` in route handlers
- page files named with the `Page.ejs` suffix
- public event browsing
- public registration CRUD for one client user
- secured admin CRUD for events
- Git and GitHub usage
- a catch-all 404 page

## Final Notes

This project should feel like a direct context swap of the original CRUD app rather than a completely different architecture. The topic changes from movies to events, but the structure, teaching style, and beginner-friendly implementation remain the same.
