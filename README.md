# CareerHub – AI-Powered Resume Manager

CareerHub is a full-stack web application designed to simplify the job application process. It helps users organize multiple resume versions, track job applications, and tailor their resumes to specific job descriptions using AI.

The platform brings resume management, application tracking, and AI-powered resume customization together in one place.

## ✨ Features

### 📄 Resume Management
- Upload and manage multiple PDF resume versions.
- Organize resumes with custom names and version labels.
- View and download saved resumes.
- Track where saved resumes are used across job applications.

### 💼 Job Application Tracking
- Add and manage job applications in one place.
- Store company names, job titles, descriptions, application dates, and notes.
- Update application details and track application statuses.
- Associate a specific resume with each application.
- View application statistics and recent activity on the dashboard.

### 🤖 AI-Powered Resume Tailoring
- Tailor existing resumes according to specific job descriptions using the Gemini API.
- Provide a job description by pasting text or uploading a PDF/TXT file.
- Select a saved resume or upload a PDF for tailoring.
- Receive an updated resume structure with relevant content prioritized.
- Get explanations of suggested changes and why they were made.
- Identify important job requirements missing from the existing resume.
- Download the tailored resume as a PDF.

**A key focus is maintaining accuracy:** AI suggestions are based on information already present in the original resume rather than inventing skills, experience, or achievements.

### 🔐 Authentication
- User registration and login.
- JWT-based authentication using HTTP-only cookies.
- Protected application routes and user-specific data access.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite|
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| AI Integration | Google Gemini API |
| Authentication | JWT, bcryptjs |
| File Storage | Cloudinary |
| File Processing | Multer, pdf-parse, PDFKit |
| API Communication | Axios |

## 🏗️ Application Architecture

CareerHub follows a client-server architecture:

- **Frontend:** React.js provides the user interface for resume management, job tracking, and AI-powered tailoring.
- **Backend:** Express.js exposes REST APIs to handle authentication, resume operations, job applications, and AI integration.
- **Database:** MongoDB stores user accounts, resume metadata, and job application records.
- **AI Service:** Google Gemini processes the existing resume content and job description to generate tailored resume content and explanations.
- **File Storage:** Cloudinary stores uploaded PDF resumes.

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js and npm
- MongoDB (local instance or MongoDB Atlas)
- Cloudinary account
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/hitakshigabani21/CareerHub.git
cd CareerHub
```

### 2. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
```

Start the backend development server:

```bash
npm run dev
```

The backend runs at `http://localhost:5000` by default.

### 3. Configure the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server runs at `http://localhost:5173` by default.

### 4. Open the Application

Visit:

```text
http://localhost:5173
```

Register an account and start managing your resumes and job applications.

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `CLIENT_ORIGIN` | Frontend origin for CORS |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for JWT authentication |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | Gemini model used for resume tailoring |



---

If you find this project useful, consider giving the repository a ⭐.
