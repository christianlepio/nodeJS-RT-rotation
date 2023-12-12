// to request data from other domain (ie: google.com)
// create a list that is allowed to access the backend
const allowedOrigins = [
    'https://www.yoursite.com', 
    'https://127.0.0.1:5500', 
    'http://localhost:3500',
    'http://localhost:5173' //React-Login-Series/1-react-form_validation
]

module.exports = allowedOrigins