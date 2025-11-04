# Q-Persona

## Enterprise-Grade Questionnaire and Persona Management Platform

Q-Persona is a sophisticated, service-oriented solution designed for organizations seeking to streamline questionnaire management and persona-based data collection. Built on cutting-edge technologies including Next.js, Supabase, and PostgreSQL, the platform delivers a scalable, maintainable architecture suitable for enterprise deployments.

## Technical Architecture

Q-Persona leverages a modern serverless architecture designed for optimal performance, scalability, and maintainability:

- **Presentation Layer**: Next.js (React framework) supporting both static and dynamic content rendering
- **Application Layer**: Supabase Backend-as-a-Service with Server Actions for secure, type-safe operations
- **Data Layer**: PostgreSQL relational database managed through Supabase infrastructure
- **Security Layer**: Supabase Authentication with enterprise-grade session management

## Information Architecture

The platform implements a hierarchical data structure designed to support complex organizational workflows:

```
Users → Personas → Templates → Questionnaires → Respondents → Answers
```

1. **Users**: Secure user account management with authentication via Supabase Auth
2. **Personas**: Customizable personas enabling role-based questionnaire deployment
3. **Templates**: Reusable questionnaire templates associated with specific personas
4. **Questionnaires**: Active survey instances deployed from template definitions
5. **Respondents**: Participant management and tracking system
6. **Answers**: Comprehensive response data collection and storage

## Technology Stack

The platform is built on a robust technology foundation ensuring reliability, performance, and developer productivity:

- **Next.js 14**: Industry-leading React framework featuring the App Router architecture
- **TypeScript**: Strongly-typed development environment ensuring code quality and maintainability
- **Tailwind CSS**: Modern utility-first CSS framework for consistent, responsive design
- **Supabase**: Comprehensive Backend-as-a-Service solution (Authentication + Database Management)
- **PostgreSQL**: Enterprise-grade relational database system managed by Supabase
- **Server Actions**: Type-safe server mutations for secure data operations

## Implementation Guide

### System Requirements

The following prerequisites are required for deployment:

- Node.js version 18 or higher
- Supabase account (complimentary tier available at [supabase.com](https://supabase.com))
- Package manager (npm or yarn)

### Installation Procedure

Follow these steps to deploy Q-Persona in your environment:

1. Clone the repository:
```bash
git clone https://github.com/Farid-Ze/Q-Persona.git
cd Q-Persona
```

2. Install project dependencies:
```bash
npm install
```

3. Configure Supabase project:
   - Navigate to [supabase.com](https://supabase.com) and establish a new project
   - Allow time for database provisioning to complete
   - Access Project Settings → API to retrieve your authentication credentials

4. Configure environment variables:
```bash
cp .env.example .env
```

Populate the `.env` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

5. Initialize database schema:
   - Access your Supabase project dashboard → SQL Editor
   - Insert the contents of `database/schema.sql`
   - Execute "Run" to deploy the schema

6. Launch the development server:
```bash
npm run dev
```

Access the application at [http://localhost:3000](http://localhost:3000) in your web browser.

## Project Structure

The codebase follows industry best practices with a clear separation of concerns:

```
Q-Persona/
├── src/
│   ├── app/                    # Next.js App Router architecture
│   │   ├── api/                # RESTful API implementation
│   │   │   ├── users/          # User management endpoints
│   │   │   ├── personas/       # Persona management endpoints
│   │   │   ├── templates/      # Template management endpoints
│   │   │   ├── questionnaires/ # Questionnaire management endpoints
│   │   │   ├── respondents/    # Respondent management endpoints
│   │   │   └── answers/        # Answer submission endpoints
│   │   ├── layout.tsx          # Application root layout
│   │   ├── page.tsx            # Landing page component
│   │   └── globals.css         # Global stylesheet definitions
│   ├── components/             # Reusable React components
│   ├── lib/                    # Utility functions and configurations
│   │   └── db.ts               # Database connection configuration
│   └── types/                  # TypeScript type definitions
│       └── index.ts            # Core type declarations
├── database/
│   └── schema.sql              # PostgreSQL database schema definition
├── .env.example                # Environment configuration template
├── next.config.js              # Next.js framework configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript compiler configuration
└── package.json                # Project dependencies and metadata
```

## API Reference

The platform provides a comprehensive RESTful API architecture with standardized JSON responses.

### User Management
- `GET /api/users` - Retrieve complete user directory
- `POST /api/users` - Register new user account

### Persona Management
- `GET /api/personas?user_id={id}` - Retrieve personas associated with specific user
- `POST /api/personas` - Create new persona configuration

### Template Management
- `GET /api/templates?persona_id={id}` - Retrieve templates for designated persona
- `POST /api/templates` - Create new questionnaire template

### Questionnaire Management
- `GET /api/questionnaires?template_id={id}&status={status}` - Retrieve questionnaires with filtering options
- `POST /api/questionnaires` - Deploy new questionnaire instance

### Respondent Management
- `GET /api/respondents?questionnaire_id={id}` - Retrieve respondent roster for questionnaire
- `POST /api/respondents` - Register new respondent

### Answer Management
- `GET /api/answers?respondent_id={id}` - Retrieve answer submissions for respondent
- `POST /api/answers` - Submit answer response

## Database Architecture

The PostgreSQL schema is engineered with enterprise requirements in mind:

- UUID-based primary keys ensuring global uniqueness
- Cascading delete operations maintaining referential integrity
- JSONB field types enabling flexible schema evolution
- Automated timestamp management via database triggers
- Performance-optimized indexes for common query patterns

Comprehensive schema documentation is available in `database/schema.sql`.

## Backend-as-a-Service Integration

Q-Persona is architected for seamless integration with leading Backend-as-a-Service providers:

### Supported BaaS Platforms

1. **Supabase**: Open-source platform providing PostgreSQL with comprehensive API generation
2. **Neon**: Serverless PostgreSQL solution featuring database branching capabilities
3. **PlanetScale**: MySQL-compatible serverless database with vitess-based architecture
4. **Railway**: Full-service infrastructure platform with managed PostgreSQL offerings

### Configuration Requirements

Configure your `.env` file with credentials provided by your selected BaaS platform:

```env
DB_HOST=your-baas-host.com
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password
DB_SSL=true  # Required for cloud-based deployments
```

## Development Operations

### Production Build

Generate an optimized production build:

```bash
npm run build
```

### Code Quality Assurance

Execute linting procedures to ensure code quality standards:

```bash
npm run lint
```

### Production Server Deployment

Launch the production-optimized server:

```bash
npm start
```

## Deployment Options

Q-Persona supports deployment across multiple enterprise-grade hosting platforms:

- **Vercel**: Optimal platform for Next.js applications with automatic optimization
- **Netlify**: Comprehensive Next.js support including serverless function deployment
- **AWS Amplify**: Complete full-stack deployment solution on Amazon Web Services
- **Railway/Render**: Container-based deployment with flexible infrastructure options

## Contributing

We welcome contributions from the development community. To contribute to Q-Persona:

1. Fork the repository to your GitHub account
2. Create a feature branch for your proposed changes
3. Implement your modifications following existing code standards
4. Submit a pull request with a comprehensive description of changes

All contributions are reviewed to ensure they align with project standards and objectives.

## License

This project is distributed as open-source software under the MIT License.

## Technical Support

For technical inquiries, bug reports, or feature requests, please submit an issue through the GitHub issue tracking system.