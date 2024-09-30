import { sleep } from 'k6';
import http from 'k6/http';

const BASE_URL = 'http://62.169.16.219:82'; // Change to your base URL

export const options = {
  vus: 30, // Number of virtual users
  duration: '2m', // Duration of the test
};

export default function () {
  login();
}

export function login() {
  const username = '22-0822'; // Replace with the desired username
  const password = 'secret'; // Replace with the desired password

  const payload = JSON.stringify({
    username: username,
    password: password,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = http.post(`${BASE_URL}/students/login/`, payload, params);
  
  if (response.status === 200) {
    const authToken = response.headers['token']; // Assuming the token is returned in headers
    console.log(`Login successful, token: ${authToken}`);
  } else {
    console.error(`Login failed: ${response.status} ${response.body}`);
  }

  sleep(1);
}
