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
