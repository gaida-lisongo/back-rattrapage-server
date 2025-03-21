# exam-server

This project is a Node.js server application that implements stateless user authentication, retrieves exam data from a MySQL database, checks user responses, stores results in a MongoDB database using Mongoose, and sends SMS notifications via an API to both the user and the jury. It utilizes RESTful services and WebSocket for real-time communication.

## Features

- Stateless user authentication
- Exam data retrieval from MySQL
- User response checking
- Results storage in MongoDB
- SMS notifications
- RESTful API
- WebSocket support for real-time updates

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd exam-server
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Configuration

- Update the database configuration in `src/config/database.ts` for MySQL and MongoDB connections.
- Configure the SMS service in `src/config/sms.ts`.

## Usage

To start the server, run:
```
npm start
```

The server will be running on `http://localhost:3000`.

## API Endpoints

- **Authentication**
  - `POST /api/auth/login`: Log in a user
  - `POST /api/auth/logout`: Log out a user

- **Exams**
  - `GET /api/exams/:id`: Retrieve exam data by ID
  - `POST /api/exams/check`: Check user responses

- **Results**
  - `POST /api/results`: Store user results

## WebSocket

The WebSocket server is set up to handle real-time communication. Connect to the WebSocket server at `ws://localhost:3000`.

## License

This project is licensed under the MIT License.