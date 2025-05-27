# The Justice League app

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.5.

## Development server

To start a local development server, run:

```bash
npm start
```

Requirements

- Angular 19
- Node.js >= 20.x
- The Justice League microservice.
  - Download the micro-server repository [here](https://github.com/Batega21/justice-league-microservice).
  - Read the `README.md` file for installation and run the microservice.

## Description

The Justice League application uses **Angular 19** for its structure and components, **Angular Material** for a cohesive UI, and **NgRx** for predictable state management using the **SignalStore**, ensuring separation of concerns, maintainability, and scalability.

## Application Structure

The application employs a modular structure, organizing code into distinct, manageable units. This approach enhances maintainability, scalability, and overall code organization.

```md
──App
  ├──Core
  |  └──Components
  |    ├──Footer
  |    ├──Header
  |    └──Not-found
  |  ├──Constant
  |  ├──Interfaces
  |  └──Services
  ├──Features
  |  └──Heroes
  |    ├──Hero container
  |    ├──Add hero
  |    ├──Edit hero
  |    ├──Hero details
  |    ├──Hero Form
  |    └──Hero List
  ├──Shared
  |  ├──Button-back
  |  ├──Dialog
  |  └──Loader
  └──State
```

## The State management

The state management is based on the SignalStore's NgRx API.

### Sources

- [SignalStore's NgRx](https://ngrx.io/guide/signals/signal-store)
- [Telerik implementation reference](https://www.telerik.com/blogs/state-management-angular-applications-using-ngrx-signals-store)

Congratulations, Gabo! That’s a huge accomplishment in such a short time—nicely done. 🎉 Here's a crafted `README.md` template for your **Justice League App**, structured for clarity and professional presentation:

---

# 🦸 Justice League App

A modern Angular 19 web application for managing your own list of DC Heroes, powered by Angular Material UI and SignalStore (NgRx). Built with performance, modularity, and developer experience in mind.

## 🚀 Features

### Core Functionality

* ✅ Add a new Hero
* ✅ View a paginated list of Heroes
* ✅ View Hero details
* ✅ Edit existing Heroes
* ✅ Delete Heroes
* ✅ Filter Heroes by name and powers

### Enhanced UX

* ✅ Angular Material design system
* ✅ Responsive layout and grid system
* ✅ Confirmation dialogs for Edit/Delete/Add
* ✅ Notification Snackbars for actions
* ✅ Loading Spinner for API interactions
* ✅ Offline local storage fallback (localStorage)

## 📦 Tech Stack

* **Angular 19**
* **SignalStore (NgRx)**
* **Angular Material**
* **Node.js** (Express.js as API server)
* **TypeScript**

## 📂 Folder Structure

```bash
src/
├── app/
│   ├── core/
│   ├── features/
│   │   └── heroes/
│   ├── shared/
│   ├── store/
│   └── app.routes.ts
├── assets/
└── environments/
```

## 🧠 State Management

State is managed with Signals and SignalStore:

* `heroes`: All loaded heroes.
* `heroesCount`: Used for pagination.
* `loading`: Controls the spinner.
* `page`, `limit`: Pagination state.
* `filteredHeroes`: Holds filtered results when a search is triggered.

## 🔄 API Endpoints

| Method | Endpoint                    | Description      |
| ------ | --------------------------- | ---------------- |
| GET    | `/superheroes`              | Fetch all heroes |
| GET    | `/superheroes/:id`          | Get hero by ID   |
| GET    | `/superheroes/pagination`   | Paginated list   |
| GET    | `/superheroes/search?name=` | Filter by name   |
| POST   | `/superheroes`              | Add a new hero   |
| PUT    | `/superheroes/:id`          | Edit a hero      |
| DELETE | `/superheroes/:id`          | Delete a hero    |

## ✅ Completed Functionality

* Hero listing, viewing, editing, deleting, adding
* Pagination
* Search and filter
* Dialogs and snackbars
* Local storage fallback
* Reactive forms and checkboxes for power selection

## 📌 Optional Next-Level Enhancements

* Hero comparison tool
* Sort by Power or Alphabetical order
* Export hero data (CSV/JSON)
* User authentication
* Dark mode toggle
* Drag-and-drop reordering

## 📸 Screenshots (Optional)

*Include if available*

## 🧪 Unit Tests

To be added in next iteration (✓ in TODO)

---

Let me know if you'd like a version with badges, deployment instructions, or enhanced visuals!
