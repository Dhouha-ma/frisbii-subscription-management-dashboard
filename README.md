# Frisbii Subscription Management Dashboard

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0.

The application provides a dashboard to manage **customers, subscriptions, and invoices**.  
It includes features such as search, pagination, and subscription state management.

---

## Development Server

To start the development server run:

```bash
ng serve
```

Then open your browser at:

http://localhost:4200/

The app will automatically reload when you change the source files.

---

## Routing & Lazy Loading

The application uses **Angular Router** and lazy loading to load feature modules only when they are needed.

---

## Signals & Change Detection

State management in the application is implemented using **Angular Signals**.

Signals are used to store UI state such as loading states, errors, and paginated data.

---

## HTTP Interceptor

An **HTTP interceptor** is used to attach authentication headers to API requests.

---

## UI & Responsiveness

The UI is designed to be **clean and responsive**, so the dashboard works well on different screen sizes.

---

## Pagination

Pagination is implemented for:

- Customers
- Invoices
- Subscriptions

Ideally pagination would be handled by the backend API.  
However, the provided API does not expose a `page` parameter.

Because of this limitation, **client-side pagination** is implemented in the frontend.

A reusable **Pagination component** together with Angular Signals is used to handle pagination.

---

## TypeScript & Code Quality

The project uses **strict TypeScript typing**.

All models, services, and component logic are strongly typed to improve maintainability and reduce runtime errors.

---

## Centralized Error Handling

API errors are handled in a consistent way using a shared `handleHttpError` utility.

Services use RxJS `catchError` to convert HTTP errors into readable error messages that components can display.

---

## Unit Testing

Unit tests cover the most important logic to ensure the core functionality works as expected.

To run the tests:

```bash
ng test
```
