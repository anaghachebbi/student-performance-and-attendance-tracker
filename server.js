const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample users (in-memory)
const users = [
  { username: 'student1', password: 'pass123', role: 'student' },
  { username: 'teacher1', password: 'pass123', role: 'teacher' },
  { username: 'manager1', password: 'pass123', role: 'management' },
];

// Sample student data
const studentData = {
  student1: {
    marks: {
      Math: 88,
      Science: 92,
      English: 85,
      History: 79,
      Art: 95,
    },
    attendance: {
      Present: 92,
      Absent: 5,
      Late: 3,
    },
  },
};

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password, role } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password && u.role === role
  );

  if (!user) {
    return res.json({ success: false, message: 'Invalid credentials or role' });
  }

  const response = {
    success: true,
    message: 'Login successful',
  };

  // If student, include marks and attendance
  if (role === 'student') {
    response.marks = studentData[username]?.marks || {};
    response.attendance = studentData[username]?.attendance || {};
  }

  res.json(response);
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
