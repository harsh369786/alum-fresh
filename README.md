# Alum Fresh — E-Commerce Website

A premium, natural alum crystal deodorant e-commerce platform built with Next.js 15, Tailwind CSS, Radix UI, Supabase, and Genkit AI.

## Architecture

- **Framework**: Next.js 15.5+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + tailwind-merge + clsx
- **UI Components**: Radix UI primitives (shadcn/ui architecture)
- **Database / Auth / Storage**: Supabase
- **Forms**: react-hook-form + Zod
- **Animations**: CSS Keyframes + Framer Motion-inspired CSS hooks
- **AI Integration**: Firebase Genkit + Google Gemini 2.0 Flash

## Project Structure

- `/src/app/` — All Next.js pages and API routes (Homepage, Category views, Cart, Admin).
- `/src/components/ui/` — Core reusable primitive components (Buttons, Inputs, Dialogs).
- `/src/components/` — Feature components (Product Cards, Carousel, Modals).
- `/src/components/layout/` — Global Header and Footer components.
- `/src/context/` — Context providers (Cart Context).
- `/src/lib/` — Utility functions, constants, types, and Supabase client setup.
- `/src/hooks/` — Custom React hooks (useCart, useProducts, useToast).
- `/src/ai/` — Genkit AI flows and configuration.

## Features Implemented

1. **Responsive UI**: Glassmorphism aesthetic with a dark-luxury teal and purple color scheme.
2. **Product Browsing**: Category filtering, sorting, product detail modals.
3. **Cart & Checkout**: Persistent cart using LocalStorage, custom discount code logic, and multi-step checkout form.
4. **Admin Dashboard**: Full CRUD management for Products, Categories, Orders, and Homepage Banners.
5. **AI Integration**: Genkit flow to automatically write product descriptions and marketing copy using Gemini 2.0.
6. **Order Emails**: Nodemailer integration to send beautifully formatted HTML order confirmations.

## Getting Started

1. Set up your `.env.local` file (use the `.env.local` template provided).
2. Run the SQL schema in `docs/supabase-seed.sql` in your Supabase project.
3. Run `npm install` to install dependencies.
4. Run `npm run dev` to start the Next.js development server.
