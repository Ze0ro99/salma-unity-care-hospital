salma-unity-care-hospital/
│
├── README.md                     # Updated with setup for chatbot and telehealth
├── LICENSE                       # License information
├── .gitignore                    # Added .env for sensitive keys
│
├── docs/                         # Documentation files
│   ├── architecture.md           # Updated with chatbot and telehealth architecture
│   ├── api/                      # API documentation
│   │   ├── api-spec.md           # Added chatbot and telehealth API specs
│   │   └── openapi.yaml          # New: OpenAPI spec for API documentation
│   ├── user-guides/              # User manuals and guides
│   │   ├── user-guide.md         # Updated with chatbot and telehealth usage
│   │   └── patient-guide.md      # New: Guide for patients using telehealth
│   └── design/                  |── architecture.md           # System architecture overview
│   └── design/                   # Design specifications and wireframes
│       └── wireframes/           # Added chatbot and telehealth wireframes
│
├── frontend/                     # Frontend application
│   ├── public/                   # Public assets
│   │   ├── index.html            # Main HTML file
│   │   ├── favicon.ico           # Favicon
│   │   └── assets/               # New: 3D models for AR/VR (future use)
│   │       └── models/           # Placeholder for AR/VR assets
│   ├── src/                      # Source code
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Header.js         # Header component
│   │   │   ├── Footer.js         # Footer component
│   │   │   ├── Modal.js          # Modal component
│   │   │   ├── Chatbot.js        # New: Chatbot widget component
│   │   │   └── IoTMonitor.js     # New: Real-time IoT vital signs display
│   │   ├── pages/                # Page components
│   │   │   ├── HomePage.js       # Home page with chatbot integration
│   │   │   ├── LoginPage.js      # Login page component
│   │   │   ├── DashboardPage.js   # Dashboard with health analytics
│   │   │   ├── PatientPortalPage.js # New: Patient portal for records and appointments
│   │   │   ├── TelehealthPage.js  # New: Telehealth video consultation page
│   │   │   └── ARViewer.js       # New: AR/VR viewer for patient education
│   │   ├── services/             # API service calls
│   │   │   ├── apiService.js     # Updated with chatbot and telehealth APIs
│   │   │   ├── authService.js    # Authentication service
│   │   │   └── telehealthService.js # New: Telehealth session management
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useFetch.js       # Custom hook for fetching data
│   │   │   └── useAuth.js        # Custom hook for authentication
│   │   ├── styles/               # Global styles and themes
│   │   │   ├── styles.css        # Updated with chatbot and telehealth styles
│   │   │   └── theme.js          # Theme configuration
│   │   ├── utils/                # Utility functions
│   │   │   ├── helpers.js        # Helper functions
│   │   │   └── constants.js      # Added constants for chatbot and telehealth
│   │   ├── context/              # React context for state management
│   │   │   └── AuthContext.js    # Authentication context
│   │   ├── locales/              # New: Multilingual support
│   │   │   ├── en.json           # English translations
│   │   │   └── id.json           # Indonesian translations
│   │   ├── i18n.js               # New: i18next configuration
│   │   └── App.js                # Updated with new routes and i18next
│   ├── tests/                    # New: Frontend unit tests
│   │   ├── components/           # Component tests
│   │   │   ├── Chatbot.test.js   # Tests for chatbot component
│   │   │   └── IoTMonitor.test.js # Tests for IoT monitor component
│   ├── package.json              # Added i18next, agora-rtc-sdk-ng, chart.js
│   └── webpack.config.js         # Webpack configuration
│
├── backend/                      # Backend application
│   ├── src/                      # Source code
│   │   ├── controllers/          # Request handlers
│   │   │   ├── userController.js  # User-related request handlers
│   │   │   ├── authController.js  # Authentication request handlers
│   │   │   ├── appointmentController.js # Appointment request handlers
│   │   │   ├── chatbotController.js # New: Chatbot message handling
│   │   │   ├── telehealthController.js # New: Telehealth session management
│   │   │   ├── analyticsController.js # New: Health analytics and trends
│   │   │   └── iotController.js   # New: IoT data handling
│   │   ├── models/               # Database models
│   │   │   ├── User.js           # User model definition
│   │   │   ├── Appointment.js     # Appointment model definition
│   │   │   ├── MedicalRecord.js   # Medical record with encrypted fields
│   │   │   └── TelehealthSession.js # New: Telehealth session model
│   │   ├── routes/               # API routes
│   │   │   ├── userRoutes.js     # User-related routes
│   │   │   ├── authRoutes.js     # Authentication routes
│   │   │   ├── appointmentRoutes.js # Appointment routes
│   │   │   ├── chatbotRoutes.js   # New: Chatbot routes
│   │   │   ├── telehealthRoutes.js # New: Telehealth routes
│   │   │   ├── analyticsRoutes.js # New: Analytics routes
│   │   │   └── iotRoutes.js      # New: IoT routes
│   │   ├── middleware/           # Custom middleware
│   │   │   ├── authMiddleware.js  # Updated with role-based access control
│   │   │   └── errorMiddleware.js # Error handling middleware
│   │   ├── services/             # Business logic and services
│   │   │   ├── userService.js    # User service implementation
│   │   │   ├── authService.js    # Authentication service implementation
│   │   │   ├── appointmentService.js # Appointment service implementation
│   │   │   ├── chatbotService.js  # New: Chatbot AI integration
│   │   │   ├── telehealthService.js # New: Telehealth session and AI analysis
│   │   │   ├── analyticsService.js # New: Health analytics processing
│   │   │   └── iotService.js     # New: IoT data processing
│   │   ├── config/               # Configuration files
│   │   │   ├── dbConfig.js       # Database configuration
│   │   │   └── envConfig.js      # Added AI and telehealth API keys
│   │   ├── utils/                # Utility functions
│   │   │   ├── logger.js         # Logger utility
│   │   │   ├── responseHandler.js # Response handler utility
│   │   │   └── crypto.js         # New: Encryption for sensitive data
│   │   └── server.js             # Updated with new routes
│   ├── tests/                    # Unit and integration tests
│   │   ├── userController.test.js # Tests for user controller
│   │   ├── authController.test.js # Tests for authentication controller
│   │   ├── appointmentController.test.js # Tests for appointment controller
│   │   ├── chatbotController.test.js # New: Tests for chatbot controller
│   │   ├── telehealthController.test.js # New: Tests for telehealth controller
│   │   ├── analyticsController.test.js # New: Tests for analytics controller
│   │   └── iotController.test.js  # New: Tests for IoT controller
│   ├── package.json              # Added agora-access-token, axios, crypto
│   └── Dockerfile                # Updated for new dependencies
│
├── database/                     # Database scripts and migrations
│   ├── migrations/               # Database migration files
│   │   ├── 20230101_create_users.js # Migration to create users table
│   │   ├── 20230102_create_appointments.js # Migration to create appointments table
│   │   ├── 20230103_create_medical_records.js # Migration to create medical records table
│   │   └── 20250417_create_telehealth_sessions.js # New: Telehealth sessions table
│   ├── seeds/                    # Seed data for initial setup
│   │   ├── seedUsers.js          # Seed script for users
│   │   ├── seedAppointments.js    # Seed script for appointments
│   │   ├── seedMedicalRecords.js  # Seed script for medical records
│   │   └── seedTelehealthSessions.js # New: Seed script for telehealth sessions
│   └── schema.sql                # Updated schema with telehealth sessions
│
├── scripts/                      # Automation scripts
│   ├── deploy.sh                 # Deployment script
│   ├── setup.sh                  # Updated with chatbot and telehealth setup
│   ├── backup.sh                 # Database backup script
│   ├── migrate.sh                # Database migration script
│   └── lint.sh                   # New: Linting script for code quality
│
├── ci-cd/                        # CI/CD configuration files
│   ├── .github/                  # GitHub Actions workflows
│   │   └── main.yml              # Updated with tests for new features
│   ├── Jenkinsfile               # Jenkins pipeline configuration
│   └── docker-compose.yml        # Updated with Redis for caching
│
└── tests/                        # End-to-end tests and test data
    ├── e2e/                      # End-to-end test scripts
    │   ├── userFlow.test.js      # End-to-end test for user flow
    │   ├── authFlow.test.js      # End-to-end test for authentication flow
    │   ├── appointmentFlow.test.js # End-to-end test for appointment flow
    │   ├── chatbotFlow.test.js    # New: End-to-end test for chatbot flow
    │   ├── telehealthFlow.test.js # New: End-to-end test for telehealth flow
    │   └── patientPortalFlow.test.js # New: End-to-end test for patient portal
    └── test-data/                # Mock data for testing
        ├── mockUsers.json        # Mock user data for tests
        ├── mockAppointments.json   # Mock appointment data for tests
        ├── mockMedicalRecords.json # Mock medical record data for tests
        └── mockTelehealthSessions.json # New: Mock telehealth session data
