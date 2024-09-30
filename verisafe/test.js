import { sleep } from 'k6';
import http from 'k6/http';

const BASE_URL = 'http://62.169.16.219:82'; // Change to your base URL

let authToken = ''; // Variable to store the authentication token
let studentId = ''; // Variable to store the student ID

export const options = {
  cloud: {
    distribution: { 'amazon:sa:cape town': { loadZone: 'amazon:sa:cape town', percent: 100 } },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    RegisterStudents: {
      executor: 'ramping-vus',
      gracefulStop: '3s',
      stages: [
        { target: 30, duration: '2m' },
        { target: 0, duration: '1m' },
      ],
      startVUs: 1,
      gracefulRampDown: '1m',
      exec: 'register_students',
    },
    UserLogin: {
      executor: 'ramping-vus',
      gracefulStop: '3s',
      stages: [
        { target: 80, duration: '3m30s' },
        { target: 0, duration: '1m' },
      ],
      startVUs: 1,
      gracefulRampDown: '2m',
      exec: 'user_login',
    },
    GetAllStudents: {
      executor: 'ramping-vus',
      gracefulStop: '3s',
      stages: [
        { target: 1, duration: '2m' },
        { target: 0, duration: '1m' },
      ],
      startVUs: 1,
      gracefulRampDown: '1m',
      exec: 'get_all_students',
    },
    ManageRewards: {
      executor: 'ramping-vus',
      gracefulStop: '3s',
      stages: [
        { target: 10, duration: '2m' },
        { target: 0, duration: '1m' },
      ],
      startVUs: 1,
      gracefulRampDown: '1m',
      exec: 'manage_rewards',
    },
  },
};

export function register_students() {
  const payload = JSON.stringify({
    first_name: 'John',
    last_name: 'Doe',
    username: 'johny',
    email: 'john@example.com',
    password: 'secret',
    national_id: '123456780',
    address: '50 Low Street',
    gender: 'male',
    campus: 'athi',
    admission_number: '22-0822',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = http.post(`${BASE_URL}/students/register/`, payload, params);
  
  if (response.status === 201) {
    studentId = response.json().id; // Assuming the student ID is returned in the response
    console.log(`Student registered successfully, ID: ${studentId}`);
  } else {
    console.error(`Registration failed: ${response.status} ${response.body}`);
  }

  sleep(1);
}

export function user_login() {
  if (!studentId) {
    console.error('Student ID not found. Please register a student first.');
    return;
  }

  const payload = JSON.stringify({
    admission_number: '22-0822',
    password: 'secret',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = http.post(`${BASE_URL}/students/login/`, payload, params);
  
  if (response.status === 200) {
    authToken = response.headers['token']; // Store the token for future requests
    console.log(`Login successful, token: ${authToken}`);
  } else {
    console.error(`Login failed: ${response.status} ${response.body}`);
  }

  sleep(1);
}

export function get_all_students() {
  if (!authToken) {
    console.error('Auth token not found. Please login first.');
    return;
  }

  const params = {
    headers: {
      'Token': authToken,
    },
  };

  const response = http.get(`${BASE_URL}/students/all`, params);
  console.log(`Get All Students Response: ${response.status} ${response.body}`);

  sleep(1);
}

export function manage_rewards() {
  if (!authToken) {
    console.error('Auth token not found. Please login first.');
    return;
  }

  if (!studentId) {
    console.error('Student ID not found. Please register a student first.');
    return;
  }

  const rewardPayload = JSON.stringify({
    student_id: studentId,
    points: 2,
    reason: 'App daily launch',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Token': authToken,
    },
  };

  let response = http.post(`${BASE_URL}/rewards/award`, rewardPayload, params);
  console.log(`New Reward Response: ${response.status} ${response.body}`);
  sleep(1);

  // Get all user rewards
  response = http.get(`${BASE_URL}/rewards/awards/${studentId}`, params);
  console.log(`Get All User Rewards Response: ${response.status} ${response.body}`);
  sleep(1);

  // Get all reward transactions
  response = http.get(`${BASE_URL}/rewards/awards/all`, params);
  console.log(`Get All Reward Transactions Response: ${response.status} ${response.body}`);
  sleep(1);

  // Get transaction ID if needed for deletion
  const transactionId = response.json().transactions[0]?.id; // Assuming the first transaction is needed
  if (transactionId) {
    response = http.delete(`${BASE_URL}/rewards/awards/${transactionId}`, params);
    console.log(`Delete Reward Transaction Response: ${response.status} ${response.body}`);
  } else {
    console.error('No transaction ID found for deletion.');
  }
  sleep(1);

  // Get leaderboard
  response = http.get(`${BASE_URL}/rewards/leaderboard`, params);
  console.log(`Leaderboard Response: ${response.status} ${response.body}`);
  sleep(1);
}
