# AGENTS.md

## Purpose

Use this file when creating a new version of this CRUD project in a different domain or context. The goal is to keep the same beginner-friendly structure, coding style, and teaching approach used in this codebase while changing the subject matter of the app.

This repo currently demonstrates:

- A single CommonJS Node.js app
- `Express`, `mongoose`, `EJS`, and `dotenv` as the main dependencies
- A single entry file named `server.js`
- Mongoose models in `models/`
- Static files in `public/`
- EJS templates in `views/`
- Route handlers written directly in `server.js`
- MongoDB as the database layer

Future versions of the project must preserve that same setup and coding style, with the additional standards listed below.

## Required Stack And Tooling

- Use `npm` as the package manager.
- Use CommonJS syntax with `require(...)`.
- The main file must be `server.js`.
- The required core dependencies are:
  - `express`
  - `mongoose`
  - `ejs`
  - `dotenv`
- `method-override` may still be used for update and delete forms.
- MongoDB Atlas is the required database service.
- Git and GitHub must be used for version control.
- Keep the app simple and server-rendered. Do not convert it into a SPA.

## Project Structure

The project should stay close to this structure:

```text
.
|-- .env
|-- .env.example
|-- .gitignore
|-- AGENTS.md
|-- package.json
|-- package-lock.json
|-- server.js
|-- models/
|-- public/
`-- views/
    `-- partials/
```

Rules:

- Keep route definitions in `server.js`.
- Keep Mongoose schemas and models in `models/`.
- Keep EJS pages in `views/`.
- Keep reusable shared EJS pieces in `views/partials/`.
- Keep static assets such as images and CSS in `public/`.
- Do not introduce a separate controller, service, or router layer unless the assignment is intentionally redesigned.

## Environment Rules

- Store all secrets in `.env`.
- Commit a `.env.example` file with placeholder values only.
- Keep `.env` in `.gitignore`.
- Use a MongoDB Atlas connection string in `.env`.
- Use a consistent environment variable name for the database connection:

```env
DB_URI=your_mongodb_atlas_connection_string
PORT=3000
```

## server.js Rules

`server.js` must follow this order:

1. Import dependencies and models.
2. Load environment variables with `require("dotenv").config();`
3. Create the Express app with `const server = express();`
4. Define the port, using `3000` as the default.
5. Set the view engine and middleware.
6. Connect to MongoDB with `mongoose.connect(...)`.
7. Define routes only after the database connection block appears.
8. End with the catch-all 404 route.

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

// routes go here
```

Important:

- The database connection must come directly after middleware settings and before the route definitions.
- Use `PORT=3000` as the standard project port.
- Keep the code readable for web programming students.

## Route Style Rules

- Define route handlers directly in `server.js`.
- Route callback functions must use `request` and `response` as parameter names, not `req` and `res`.
- Keep route comments simple and descriptive, similar to the current project.
- Continue using REST-style CRUD routes for the main entity.
- Use redirects after create, update, and delete operations when appropriate.
- Keep route logic readable and beginner-friendly rather than overly abstract.

Preferred example:

```js
server.get("/items", async (request, response) => {
  const items = await Item.find();
  response.render("itemsIndexPage", { items });
});
```

## Model Style Rules

- Keep one main Mongoose model per file.
- Use `const Schema = mongoose.Schema;`
- Define clear field types and `required` rules.
- Export the model with `module.exports = ModelName;`
- Keep schema files short and readable.

Preferred pattern:

```js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const Item = mongoose.model("Item", itemSchema, "items");
module.exports = Item;
```

## View Style Rules

- Use EJS for all rendered pages.
- All page view files must follow this naming pattern:
  - `<exampleView>Page.ejs`
- Examples:
  - `itemsIndexPage.ejs`
  - `itemsNewPage.ejs`
  - `itemShowPage.ejs`
  - `itemsEditPage.ejs`
  - `adminItemsIndexPage.ejs`
- Shared layouts or navigation should go in `views/partials/`.
- Keep forms simple and readable for students.
- Continue using server-rendered forms for create and edit flows.

## Client Side And Admin Dashboard

The new project must include:

- A client-facing side for regular users
- An admin dashboard for management tasks

Implementation rule:

- Keep both inside the same Express app.
- Use route prefixes to separate them, such as:
  - `/` or `/<entity>` for client pages
  - `/admin` for dashboard pages

Examples:

- `/books`
- `/books/:id`
- `/admin/books`
- `/admin/books/new`
- `/admin/books/:id/edit`

This keeps the project aligned with the current simple structure while still adding a second interface.

## Naming And Style Conventions

- Use clear, domain-based names for models, variables, and routes.
- Keep semicolon-based JavaScript formatting.
- Stay consistent with the current straightforward coding style.
- Prefer simple async/await route handlers.
- Avoid introducing patterns that are too advanced for the course level unless required by the assignment.

## Do Not Introduce

Unless the course requirements change, do not introduce the following:

- TypeScript
- React, Vue, Angular, or another SPA frontend
- A separate API-only backend
- Another package manager such as Yarn or pnpm
- Another database system in place of MongoDB Atlas
- A renamed main entry file other than `server.js`
- A different route callback parameter style such as `req` and `res`

## Minimum Project Checklist

Before considering a context-swapped version complete, confirm that it includes:

- `server.js` as the app entrypoint
- `npm` scripts in `package.json`
- `.env` and `.env.example`
- `Express`, `mongoose`, `EJS`, and `dotenv`
- Middleware setup before `mongoose.connect(...)`
- Database connection before route definitions
- `PORT` set to `3000`
- EJS page names ending with `Page.ejs`
- A MongoDB Atlas connection
- Client-facing routes
- Admin dashboard routes
- Git and GitHub usage
- A catch-all 404 page

## Notes For Future Agents Or Instructors

- Preserve the teaching value of the original project. The code should remain approachable for students who are learning CRUD fundamentals.
- When changing the domain, keep the architecture the same even if the entity names, forms, and page content change.
- If the current repo and a new assignment requirement conflict, follow the explicit rules in this file for future versions of the project.
