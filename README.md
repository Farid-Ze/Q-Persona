# Q-Persona

A modern, lean service-based architecture for questionnaire and persona management built with Next.js and PostgreSQL.

## Architecture Overview

Q-Persona implements a serverless/semi-serverless architecture with:

- **Frontend**: Next.js (React) with static and dynamic rendering
- **Backend**: Backend as a Service (BaaS) approach with serverless API routes
- **Database**: PostgreSQL managing the complete data flow
- **Authentication**: Modern authentication system (ready for integration)

## Data Flow

The application follows a structured data hierarchy:

```
Users → Personas → Templates → Questionnaires → Respondents → Answers
```

1. **Users**: User accounts and authentication
2. **Personas**: User-created personas for different purposes
3. **Templates**: Reusable questionnaire templates linked to personas
4. **Questionnaires**: Active surveys created from templates
5. **Respondents**: Participants in questionnaires
6. **Answers**: Individual responses to questionnaire questions

## Technology Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **PostgreSQL**: Relational database
- **Serverless Functions**: API routes for backend logic

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or cloud-based BaaS)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Farid-Ze/Q-Persona.git
cd Q-Persona
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials.

4. Set up the database:
```bash
# Connect to your PostgreSQL database and run:
psql -U your_user -d your_database -f database/schema.sql
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Q-Persona/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # Serverless API routes
│   │   │   ├── users/          # User management endpoints
│   │   │   ├── personas/       # Persona endpoints
│   │   │   ├── templates/      # Template endpoints
│   │   │   ├── questionnaires/ # Questionnaire endpoints
│   │   │   ├── respondents/    # Respondent endpoints
│   │   │   └── answers/        # Answer endpoints
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   ├── lib/                    # Utilities and configurations
│   │   └── db.ts               # Database configuration
│   └── types/                  # TypeScript type definitions
│       └── index.ts            # Core types
├── database/
│   └── schema.sql              # PostgreSQL database schema
├── .env.example                # Environment variables template
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies
```

## API Endpoints

All API endpoints follow RESTful conventions and return JSON responses.

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create a new user

### Personas
- `GET /api/personas?user_id={id}` - List personas for a user
- `POST /api/personas` - Create a new persona

### Templates
- `GET /api/templates?persona_id={id}` - List templates for a persona
- `POST /api/templates` - Create a new template

### Questionnaires
- `GET /api/questionnaires?template_id={id}&status={status}` - List questionnaires
- `POST /api/questionnaires` - Create a new questionnaire

### Respondents
- `GET /api/respondents?questionnaire_id={id}` - List respondents
- `POST /api/respondents` - Create a new respondent

### Answers
- `GET /api/answers?respondent_id={id}` - List answers
- `POST /api/answers` - Submit an answer

## Database Schema

The PostgreSQL schema includes:

- UUID primary keys for all tables
- Cascading deletes to maintain referential integrity
- JSONB fields for flexible data storage
- Automatic timestamp management with triggers
- Optimized indexes for common queries

See `database/schema.sql` for the complete schema definition.

## BaaS Integration

This project is designed to work with Backend as a Service providers:

### Recommended BaaS Providers

1. **Supabase**: Open-source Firebase alternative with PostgreSQL
2. **Neon**: Serverless PostgreSQL with branching
3. **PlanetScale**: MySQL-compatible serverless database
4. **Railway**: Infrastructure platform with PostgreSQL support

### Configuration

Update your `.env` file with the connection details from your BaaS provider:

```env
DB_HOST=your-baas-host.com
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password
DB_SSL=true  # Required for most cloud providers
```

## Development

### Building

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Starting Production Server

```bash
npm start
```

## Deployment

This project can be deployed to:

- **Vercel**: Recommended for Next.js applications
- **Netlify**: Supports Next.js with serverless functions
- **AWS Amplify**: Full-stack deployment
- **Railway/Render**: Container-based deployment

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.