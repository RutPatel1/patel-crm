# PatelCRM - B2B SaaS CRM for Manufacturing Industry

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FRutPatel1%2Fpatel-crm)

A comprehensive multi-tenant CRM application built with Next.js 14, MongoDB, and Google Gemini AI.

## Features

✅ Multi-tenant architecture with complete data isolation  
✅ Role-based access control (Admin, Company Admin, Company User)  
✅ JWT authentication with secure token management  
✅ Leads management with full CRUD operations  
✅ AI-powered report generation using Google Gemini  
✅ PDF export functionality  
✅ Admin panel for company management  
✅ Premium responsive UI with Tailwind CSS  

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes (Serverless)
- **Database:** MongoDB Atlas
- **AI:** Google Gemini Pro
- **Authentication:** JWT + bcryptjs
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Google Cloud account with Gemini API access

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd patel-crm
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_random_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### Create Admin Account

Visit `http://localhost:3000/setup` to create your PatelCRM admin account.

## Deployment to Vercel

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

See full deployment guide in the documentation.

## Environment Variables

Required for production:

- `MONGODB_URI` - MongoDB connection string
- `GEMINI_API_KEY` - Google Gemini API key
- `JWT_SECRET` - Random secret for JWT signing
- `NEXT_PUBLIC_APP_URL` - Your app URL

## Project Structure

```
patel-crm/
├── app/              # Next.js 14 App Router
├── lib/              # Utilities (DB, Auth, AI)
├── models/           # MongoDB models
├── middleware/       # Auth middleware
├── types/            # TypeScript types
└── public/           # Static assets
```

## Login Credentials

**Customer Account:** Sign up at `/signup`

**Admin Account:** Create at `/setup` (first time only)
- Email: admin@patelcrm.com
- Password: pateladmin123

## Documentation

- Full walkthrough available in `/docs`
- API documentation in implementation plan
- Architecture details in codebase

## Security

- Password hashing with bcryptjs
- JWT token authentication
- Multi-tenant data isolation
- Role-based access control
- Environment variable protection

## License

MIT

## Support

For support, contact your development team or refer to the documentation.
