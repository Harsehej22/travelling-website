# Travel Site - Full Stack Application

A complete travel website with frontend and backend functionality including user authentication, contact forms, and data storage.

## Features

### Frontend
- **Responsive Design**: Mobile-friendly layout
- **Enhanced Gallery**: Categorized images with search and lightbox
- **User Authentication**: Login and registration forms
- **Contact Form**: User message submission
- **Modern UI**: Beautiful animations and hover effects

### Backend
- **Node.js Server**: Express.js backend
- **SQLite Database**: Local data storage
- **User Management**: Registration, login, and authentication
- **Contact System**: Store and retrieve user messages
- **Booking System**: Travel package bookings
- **Admin Dashboard**: View all stored data

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Main site: `http://localhost:3000`
   - Dashboard: `http://localhost:3000/dashboard`

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact-messages` - Get all contact messages

### Users
- `GET /api/users` - Get all registered users

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## Database Schema

### Users Table
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `created_at` - Registration timestamp

### Contact Messages Table
- `id` - Primary key
- `name` - Sender's name
- `email` - Sender's email
- `phone` - Sender's phone number
- `subject` - Message subject
- `message` - Message content
- `created_at` - Submission timestamp

### Bookings Table
- `id` - Primary key
- `user_id` - Reference to user (optional)
- `package_name` - Travel package name
- `travel_date` - Planned travel date
- `number_of_people` - Number of travelers
- `total_amount` - Booking cost
- `status` - Booking status (pending/confirmed)
- `created_at` - Booking timestamp

## File Structure

```
travel-site/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── dashboard.html         # Admin dashboard
├── contact.html           # Contact page
├── gallery.html           # Enhanced gallery page
├── script.js              # Frontend JavaScript
├── style.css              # Styling
├── README.md              # This file
└── travel_site.db         # SQLite database (created automatically)
```

## Usage

### For Users
1. **Browse Gallery**: View categorized travel images
2. **Contact Support**: Send messages through contact form
3. **Register/Login**: Create account for personalized experience

### For Administrators
1. **Access Dashboard**: Visit `/dashboard` to view all data
2. **Monitor Activity**: Check user registrations, messages, and bookings
3. **Data Management**: View stored information in organized tables

## Security Features

- **Password Hashing**: Bcrypt encryption for user passwords
- **JWT Tokens**: Secure authentication tokens
- **Input Validation**: Server-side form validation
- **CORS Protection**: Cross-origin request handling

## Development

### Adding New Features
1. Update the database schema in `server.js`
2. Add new API endpoints
3. Update frontend forms and JavaScript
4. Test thoroughly before deployment

### Database Modifications
The SQLite database is created automatically when the server starts. To modify the schema:
1. Stop the server
2. Delete `travel_site.db`
3. Update the CREATE TABLE statements in `server.js`
4. Restart the server

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Change the port in `server.js`
   - Kill existing processes using the port

2. **Database Errors**
   - Check if `travel_site.db` has proper permissions
   - Verify SQLite installation

3. **Frontend Not Loading**
   - Ensure server is running
   - Check browser console for errors
   - Verify file paths in HTML files

### Logs
Check the terminal where the server is running for error messages and debugging information.

## License

MIT License - Feel free to modify and distribute.

## Support

For issues or questions, check the troubleshooting section or review the code comments for guidance.

