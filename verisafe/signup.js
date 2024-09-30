import { sleep } from 'k6';
import http from 'k6/http';

const BASE_URL = 'http://62.169.16.219:82'; // Change to your base URL

export const options = {
  cloud: {
    distribution: { 'amazon:sa:cape town': { loadZone: 'amazon:sa:cape town', percent: 100 } },
    apm: [],
  },
  thresholds: {},
  vus: 100, // Number of virtual users
  duration: '5m', // Duration of the test
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(arr) {
  return arr[getRandomInt(0, arr.length - 1)];
}

export default function () {
  register_students();
}

export function register_students() {
  const firstNames = [
    'John', 'Jane', 'Alex', 'Emily', 'Michael', 'Sarah', 'David', 'Laura',
    'Chris', 'Jessica', 'James', 'Linda', 'Robert', 'Karen', 'Daniel', 
    'Nina', 'Matthew', 'Samantha', 'Andrew', 'Rachel', 'Joshua', 'Amanda', 
    'Ryan', 'Michelle', 'Kevin', 'Ashley', 'Jason', 'Deborah', 'Brian', 
    'Tina', 'Tyler', 'Angela', 'Charles', 'Kimberly', 'Dylan', 'Nicole',
    'Ethan', 'Patricia', 'Henry', 'Sophie', 'Paul', 'Elizabeth', 'Samuel',
    'Megan', 'Steven', 'Hannah', 'Jack', 'Emma', 'Luke', 'Isabella', 
    'Jordan', 'Abigail', 'Isaac', 'Mia', 'Nathan', 'Chloe', 'Adrian', 
    'Lily', 'Alexis', 'Jonathan', 'Zoe', 'Anthony', 'Ava', 'Benjamin',
    'Grace', 'Gabriel', 'Victoria', 'William', 'Sophia', 'Joseph', 
    'Madison', 'Logan', 'Scarlett', 'Jaxon', 'Amelia', 'Carter', 
    'Ella', 'Owen', 'Ariana', 'Lucas', 'Layla', 'Caleb', 'Hailey'
  ];

  const lastNames = [
    'Doe', 'Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Garcia', 
    'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore',
    'Martin', 'Jackson', 'Lee', 'Perez', 'Thompson', 'White', 
    'Harris', 'Sanchez', 'Clark', 'Robinson', 'Lewis', 'Walker', 
    'Hall', 'Allen', 'Young', 'King', 'Wright', 'Scott', 'Torres', 
    'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 
    'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 
    'Gonzalez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 
    'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 
    'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy', 'Bailey', 'Rivera'
  ];

  const genders = ['male', 'female'];

  const payload = JSON.stringify({
    first_name: getRandomElement(firstNames),
    last_name: getRandomElement(lastNames),
    username: `user${getRandomInt(10000, 99999)}`,
    email: `user${getRandomInt(10000, 99999)}@example.com`,
    password: 'secret123',
    national_id: `${getRandomInt(100000000, 999999999)}`, // 9-digit number
    address: `${getRandomInt(1, 100)} ${getRandomElement(lastNames)} St.`,
    gender: getRandomElement(genders),
    campus: 'athi', // Assuming this is a fixed value
    admission_number: `22-${getRandomInt(1000, 9999)}`, // Random admission number
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = http.post(`${BASE_URL}/students/register/`, payload, params);
  
  if (response.status === 201) {
    const studentId = response.json().id; // Assuming the student ID is returned in the response
    console.log(`Student registered successfully, ID: ${studentId}`);
  } else {
    console.error(`Registration failed: ${response.status} ${response.body}`);
  }

  sleep(1);
}
