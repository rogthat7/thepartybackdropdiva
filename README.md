# The Party Backdrop Diva

Welcome to **The Party Backdrop Diva**—a premier, luxury web application designed for a high-end event styling, backdrop rental, and premium catering business. The platform provides clients with an immersive, visually stunning experience to explore curated event environments and customize their dining packages, while offering a robust backend for staff to manage consultations and leads.

## 🎯 Project Purpose

The goal of this project is to create a digital storefront and management system that reflects the premium, luxurious nature of the services offered. Key objectives include:
- **Immersive Discovery**: Allowing clients to browse high-resolution backdrop series (like the *Victorian Rose Garden* or *Springtime Tulip Burst*) through an elegant, interactive gallery.
- **Customizable Catering**: Offering a tiered catering menu (Silver, Gold, Platinum) with the ability for clients to build bespoke packages and get real-time price estimates based on guest count.
- **Client & Staff Portals**: Providing role-based access for clients to view their events and for staff (Admins, Advisors, Support) to manage leads, assignments, and support tickets.

## 🚀 Progress So Far

The project has achieved significant milestones in both UI/UX and backend infrastructure:
- **Luxury UI/UX Implementation**: Developed a fully responsive frontend utilizing Tailwind CSS with a custom luxury aesthetic (gold accents, glassmorphism, smooth animations). Full support for both **Light and Dark themes**.
- **Interactive Backdrop Gallery**: Built a "Series Explorer" featuring fading slideshow covers, detailed lightbox carousels, and variation breakdowns.
- **Dynamic Catering Selector**: Implemented a state-of-the-art package selection interface with custom CSS animations (e.g., RGB running borders, shiny metallic sweeps) and a custom package builder.
- **Role-Based Dashboards**: Completed dedicated views for Administrators (Lead Management), Advisors (Assigned Consultations), and Support staff.
- **Database Persistence & Seeding**: Configured Entity Framework Core with a PostgreSQL database, including a comprehensive `SeedService` that populates the database with initial backdrop imagery and menu items.
- **Containerization**: Successfully dockerized the entire stack using `docker-compose`, enabling seamless local development and production-ready deployments.
- **UX Refinements**: Replaced standard browser alerts with modern, non-blocking toast notifications using `react-hot-toast` and refined typography/contrast for maximum legibility across themes.

## 🛠️ Technologies Used

### Frontend
- **React 19 & TypeScript**: Building block for scalable, type-safe UI components.
- **Vite**: Ultra-fast build tool and development server.
- **Tailwind CSS v4**: Utility-first CSS framework customized with a bespoke luxury design system.
- **React Router**: For seamless, client-side navigation.
- **React Bootstrap**: For underlying component structures (e.g., Carousels).
- **React Hot Toast**: For elegant, modern user notifications.
- **FontAwesome**: For scalable vector icons.

### Backend
- **ASP.NET Core 10 Web API**: Robust, high-performance backend architecture.
- **Entity Framework Core**: ORM for data access and management.
- **PostgreSQL**: Reliable, open-source relational database.

### Infrastructure & DevOps
- **Docker & Docker Compose**: Containerizing the Database, API, Mailpit, and Nginx-served UI for unified deployment.
- **Nginx**: Serving the built Vite static assets in the UI container.
- **Mailpit**: Used in development to catch and test outbound emails.

## 📦 Getting Started

To run the project locally, ensure you have Docker Desktop installed on your machine.

1. **Clone the repository** to your local machine.
2. **Navigate to the solution directory**:
   ```bash
   cd thepartybackdropdiva
   ```
3. **Spin up the containers**:
   ```bash
   docker compose up -d --build
   ```
4. **Access the Application**:
   - The User Interface will be available at `http://localhost:5148`
   - The Database (PostgreSQL) is accessible on port `5432`

## 🎨 Design Philosophy

Every component in *The Party Backdrop Diva* is crafted with a focus on aesthetics. From the subtle micro-animations on hover states to the carefully selected typography and high-contrast dark mode, the application is designed to evoke a sense of exclusivity and premium service.
