# AI Rules for Lovable Project

This document outlines the core technologies used in this project and provides guidelines for their usage.

## Tech Stack Overview

This project is built with a modern web development stack, focusing on performance, maintainability, and a great developer experience.

*   **Vite**: A fast build tool that provides an instant development server and optimized builds.
*   **TypeScript**: A superset of JavaScript that adds static type definitions, improving code quality and developer productivity.
*   **React**: A declarative, component-based JavaScript library for building user interfaces.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs directly in your markup.
*   **shadcn/ui**: A collection of re-usable components built with Radix UI and Tailwind CSS, providing accessible and customizable UI elements.
*   **React Router DOM**: The standard library for routing in React applications, enabling navigation between different views.
*   **Supabase**: An open-source Firebase alternative providing a PostgreSQL database, authentication, instant APIs, and edge functions.
*   **Tanstack Query (React Query)**: A powerful library for managing, caching, and synchronizing server state in React applications.
*   **Lucide React**: A library of beautiful, pixel-perfect icons for React applications.
*   **Sonner**: A modern, accessible, and customizable toast library for displaying notifications.
*   **React Hook Form & Zod**: A combination for efficient form management and schema-based validation.

## Library Usage Guidelines

To maintain consistency and leverage the strengths of each library, please adhere to the following rules:

*   **UI Components**:
    *   Always prioritize `shadcn/ui` components for common UI elements (buttons, cards, inputs, dialogs, etc.).
    *   If a specific `shadcn/ui` component is not available or requires significant deviation from its intended design, create a new component in `src/components/` and style it using Tailwind CSS.
    *   **DO NOT** modify files within `src/components/ui/` as these are managed by `shadcn/ui`.
*   **Styling**:
    *   All styling should be done using **Tailwind CSS** classes. Avoid writing custom CSS unless absolutely necessary for global styles or specific utilities defined in `src/index.css`.
    *   Ensure designs are responsive by utilizing Tailwind's responsive utility classes.
*   **Icons**:
    *   Use icons from the `lucide-react` library.
*   **Routing**:
    *   Manage all client-side routing using `react-router-dom`.
    *   Define all main application routes within `src/App.tsx`.
*   **State Management & Data Fetching**:
    *   For managing server-side data and complex asynchronous operations, use `@tanstack/react-query`.
    *   For local component state, use React's built-in `useState` and `useReducer` hooks.
*   **Backend Interaction**:
    *   All interactions with the backend (database queries, authentication, function calls) must use the `supabase` client from `@supabase/supabase-js` (imported as `supabase` from `src/integrations/supabase/client.ts`).
*   **Form Handling**:
    *   Implement forms using `react-hook-form` for efficient state management and validation.
    *   Use `zod` for defining form schemas and validation rules.
*   **Toast Notifications**:
    *   Use `sonner` for displaying all user-facing toast notifications.
*   **Carousels**:
    *   For any carousel functionality, use `embla-carousel-react`.
*   **Date Pickers**:
    *   For date selection, utilize components from `react-day-picker`.