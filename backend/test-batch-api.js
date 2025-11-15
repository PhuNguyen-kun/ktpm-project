const axios = require("axios");

const API_URL = "http://localhost:8000/api"; // Adjust if your API runs on a different port
const TOKEN = ""; // Add your JWT token here

async function testBatchCreation() {
    try {
        // Test with specific households
        const response = await axios.post(
            `${API_URL}/household-fee-assignments/batch`,
            {
                fee_campaign_id: 1, // Replace with a valid fee campaign ID from your database
                household_ids: [1, 2, 3], // Replace with valid household IDs from your database
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Response status:", response.status);
        console.log("Data:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("Error testing batch creation:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

// Run the test
testBatchCreation();

/* 
To run this test:
1. Make sure your backend server is running
2. Add a valid JWT token to the TOKEN constant
3. Run: node test-batch-api.js
*/
