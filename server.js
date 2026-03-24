const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const Event = require("./models/Event");
const Registration = require("./models/Registration");
require("dotenv").config();

const server = express();
const port = process.env.PORT || 3000;
const dbURI = process.env.DB_URI;
const defaultEventImage =
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80";

server.set("view engine", "ejs");
server.use(express.static("public"));
server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(methodOverride("_method"));
server.use(
  session({
    secret: process.env.SESSION_SECRET || "event-hub-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
    },
  })
);

mongoose
  .connect(dbURI)
  .then(() =>
    server.listen(port, () => {
      console.log(`Listening on port ${port}`);
    })
  )
  .catch((error) => console.log(error));

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function formatDateForInput(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().split("T")[0];
}

function buildEventData(requestBody) {
  return {
    title: requestBody.title,
    date: requestBody.date,
    location: requestBody.location,
    category: requestBody.category,
    image: requestBody.image,
    description: requestBody.description,
    availableSlots: Number(requestBody.availableSlots),
  };
}

function buildRegistrationData(requestBody, event) {
  return {
    eventId: event._id,
    eventTitle: event.title,
    attendeeName: requestBody.attendeeName,
    attendeeEmail: requestBody.attendeeEmail,
    ticketCount: Number(requestBody.ticketCount),
    status: "Confirmed",
  };
}

function hasValidId(idValue) {
  return mongoose.Types.ObjectId.isValid(idValue);
}

function ensureAdmin(request, response, next) {
  if (!request.session.isAdminLoggedIn) {
    return response.redirect("/admin/login");
  }

  next();
}

server.use((request, response, next) => {
  response.locals.currentPath = request.path;
  response.locals.isAdminLoggedIn = request.session.isAdminLoggedIn || false;
  response.locals.defaultEventImage = defaultEventImage;
  response.locals.formatDate = formatDate;
  response.locals.formatDateForInput = formatDateForInput;
  next();
});

// home page route
server.get("/", async (request, response) => {
  const featuredEvents = await Event.find().sort({ date: 1 }).limit(3);

  response.render("homePage", {
    pageTitle: "Event Hub",
    featuredEvents,
    message: request.query.message || "",
  });
});

// registrations page route
server.get("/events/registrations", async (request, response) => {
  const registrations = await Registration.find().sort({ createdAt: -1 });

  response.render("registrationsIndexPage", {
    pageTitle: "Your Registrations",
    registrations,
    message: request.query.message || "",
  });
});

// registration form route
server.get("/events/registrations/:id", async (request, response) => {
  if (!hasValidId(request.params.id)) {
    return response.status(404).render("notFoundPage", {
      pageTitle: "Page Not Found",
    });
  }

  const event = await Event.findById(request.params.id);

  if (!event) {
    return response.status(404).render("notFoundPage", {
      pageTitle: "Page Not Found",
    });
  }

  response.render("registrationNewPage", {
    pageTitle: "Register For Event",
    event,
    formData: {
      attendeeName: "",
      attendeeEmail: "",
      ticketCount: 1,
    },
    errorMessage: "",
  });
});

// create registration route
server.post("/events/registrations", async (request, response) => {
  if (!hasValidId(request.body.eventId)) {
    return response.status(404).render("notFoundPage", {
      pageTitle: "Page Not Found",
    });
  }

  const event = await Event.findById(request.body.eventId);

  if (!event) {
    return response.status(404).render("notFoundPage", {
      pageTitle: "Page Not Found",
    });
  }

  const formData = {
    attendeeName: request.body.attendeeName,
    attendeeEmail: request.body.attendeeEmail,
    ticketCount: request.body.ticketCount,
  };

  const ticketCount = Number(request.body.ticketCount);

  if (!ticketCount || ticketCount < 1) {
    return response.status(400).render("registrationNewPage", {
      pageTitle: "Register For Event",
      event,
      formData,
      errorMessage: "Please choose at least one ticket.",
    });
  }

  if (ticketCount > event.availableSlots) {
    return response.status(400).render("registrationNewPage", {
      pageTitle: "Register For Event",
      event,
      formData,
      errorMessage: "There are not enough available slots for that request.",
    });
  }

  try {
    const registrationData = buildRegistrationData(request.body, event);

    await Registration.create(registrationData);
    event.availableSlots = event.availableSlots - ticketCount;
    await event.save();

    response.redirect(
      "/events/registrations?message=Registration created successfully."
    );
  } catch (error) {
    response.status(400).render("registrationNewPage", {
      pageTitle: "Register For Event",
      event,
      formData,
      errorMessage: "Please complete all of the registration fields.",
    });
  }
});

// delete registration route
server.delete("/events/registrations/:id", async (request, response) => {
  if (!hasValidId(request.params.id)) {
    return response.redirect(
      "/events/registrations?message=That registration could not be found."
    );
  }

  const registration = await Registration.findById(request.params.id);

  if (!registration) {
    return response.redirect(
      "/events/registrations?message=That registration could not be found."
    );
  }

  const event = await Event.findById(registration.eventId);

  if (event) {
    event.availableSlots = event.availableSlots + registration.ticketCount;
    await event.save();
  }

  await Registration.findByIdAndDelete(request.params.id);

  response.redirect(
    "/events/registrations?message=Registration deleted successfully."
  );
});

// events index route
server.get("/events", async (request, response) => {
  const events = await Event.find().sort({ date: 1 });

  response.render("eventsIndexPage", {
    pageTitle: "Explore Events",
    events,
    message: request.query.message || "",
  });
});

// single event route
server.get("/events/:id", async (request, response) => {
  if (!hasValidId(request.params.id)) {
    return response.status(404).render("notFoundPage", {
      pageTitle: "Page Not Found",
    });
  }

  const event = await Event.findById(request.params.id);

  if (!event) {
    return response.status(404).render("notFoundPage", {
      pageTitle: "Page Not Found",
    });
  }

  response.render("eventShowPage", {
    pageTitle: event.title,
    event,
    message: request.query.message || "",
  });
});

// admin login page route
server.get("/admin/login", (request, response) => {
  if (request.session.isAdminLoggedIn) {
    return response.redirect("/admin/events");
  }

  response.render("adminLoginPage", {
    pageTitle: "Admin Login",
    errorMessage: "",
  });
});

// admin login route
server.post("/admin/login", (request, response) => {
  const { username, password } = request.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    request.session.isAdminLoggedIn = true;
    return response.redirect("/admin/events");
  }

  response.status(401).render("adminLoginPage", {
    pageTitle: "Admin Login",
    errorMessage: "Incorrect username or password.",
  });
});

// admin logout route
server.post("/admin/logout", ensureAdmin, (request, response) => {
  request.session.destroy(() => {
    response.redirect("/admin/login");
  });
});

// admin events page route
server.get("/admin/events", ensureAdmin, async (request, response) => {
  const events = await Event.find().sort({ date: 1 });

  response.render("adminEventsIndexPage", {
    pageTitle: "Manage Events",
    events,
    message: request.query.message || "",
  });
});

// admin new event page route
server.get("/admin/events/new", ensureAdmin, (request, response) => {
  response.render("adminEventsNewPage", {
    pageTitle: "Add New Event",
    formData: {
      title: "",
      date: "",
      location: "",
      category: "",
      image: "",
      description: "",
      availableSlots: "",
    },
    errorMessage: "",
  });
});

// admin create event route
server.post("/admin/events", ensureAdmin, async (request, response) => {
  const formData = buildEventData(request.body);

  try {
    await Event.create(formData);

    response.redirect("/admin/events?message=Event created successfully.");
  } catch (error) {
    response.status(400).render("adminEventsNewPage", {
      pageTitle: "Add New Event",
      formData: request.body,
      errorMessage: "Please complete every event field correctly.",
    });
  }
});

// admin edit event page route
server.get("/admin/events/:id/edit", ensureAdmin, async (request, response) => {
  if (!hasValidId(request.params.id)) {
    return response.status(404).render("notFoundPage", {
      pageTitle: "Page Not Found",
    });
  }

  const event = await Event.findById(request.params.id);

  if (!event) {
    return response.status(404).render("notFoundPage", {
      pageTitle: "Page Not Found",
    });
  }

  response.render("adminEventsEditPage", {
    pageTitle: "Edit Event",
    event,
    errorMessage: "",
  });
});

// admin update event route
server.patch("/admin/events/:id", ensureAdmin, async (request, response) => {
  if (!hasValidId(request.params.id)) {
    return response.status(404).render("notFoundPage", {
      pageTitle: "Page Not Found",
    });
  }

  const event = await Event.findById(request.params.id);

  if (!event) {
    return response.status(404).render("notFoundPage", {
      pageTitle: "Page Not Found",
    });
  }

  const formData = buildEventData(request.body);

  try {
    await Event.findByIdAndUpdate(request.params.id, formData, {
      runValidators: true,
    });

    response.redirect("/admin/events?message=Event updated successfully.");
  } catch (error) {
    response.status(400).render("adminEventsEditPage", {
      pageTitle: "Edit Event",
      event: {
        _id: request.params.id,
        ...request.body,
      },
      errorMessage: "Please complete every event field correctly.",
    });
  }
});

// admin delete event route
server.delete("/admin/events/:id", ensureAdmin, async (request, response) => {
  if (!hasValidId(request.params.id)) {
    return response.redirect("/admin/events?message=That event could not be found.");
  }

  await Registration.deleteMany({ eventId: request.params.id });
  await Event.findByIdAndDelete(request.params.id);

  response.redirect("/admin/events?message=Event deleted successfully.");
});

// 404 route
server.use((request, response) => {
  response.status(404).render("notFoundPage", {
    pageTitle: "Page Not Found",
  });
});
