const axios = require('axios');
const jwt = require('jsonwebtoken');

const API_URL = 'http://localhost:8000/api';
const JWT_SECRET = 'ai_job_portal_secret_key_2026';

async function testResponse() {
    try {
        console.log("Simulating frontend request to /api/jobs...");

        // Create token for Sandeep S (ID 2)
        const token = jwt.sign(
            { id: 2, email: 'sandeep12@gmail.com', role: 'user', username: 'Sandeep S' },
            JWT_SECRET
        );

        const res = await axios.get(`${API_URL}/jobs`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const jobs = res.data;
        const job = jobs.find(j => j.id === 1);

        console.log("Full job object for ID 1:");
        console.log(JSON.stringify(job, null, 2));

        if (job.is_applied === true) {
            console.log("\n✅ Test Passed: is_applied is true.");
        } else {
            console.log("\n❌ Test Failed: is_applied is", job.is_applied);
        }

    } catch (err) {
        console.error("Test failed:", err.message);
        if (err.response) {
            console.log("Response data:", err.response.data);
        }
    }
}

testResponse();
