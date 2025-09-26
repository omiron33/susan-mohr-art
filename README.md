# Susan Mohr Art

A modern art gallery website built with Next.js, featuring a headless CMS powered by Directus and integrated e-commerce with Stripe.

## Features

- 🎨 **Art Gallery**: Browse artwork by categories with lightbox viewing
- 🖼️ **Print Sales**: Purchase prints with integrated Stripe checkout
- 📱 **Responsive Design**: Mobile-first design with modern UI components
- 🎯 **SEO Optimized**: Built-in sitemap, robots.txt, and metadata
- ⚡ **Performance**: Optimized images and fast loading times
- 🛒 **E-commerce**: Secure payment processing with Stripe

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **CMS**: Directus (headless CMS)
- **Payments**: Stripe
- **Email**: Resend
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see `.env.example`)
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `DIRECTUS_URL`: Your Directus CMS URL
- `STRIPE_SECRET_KEY`: Stripe secret key for payments
- `RESEND_API_KEY`: API key for email functionality
- `SITE_URL`: Your production site URL

## Deployment

This project is optimized for deployment on Vercel. The production build includes:

- Static generation for optimal performance
- Image optimization
- SEO metadata
- Sitemap generation