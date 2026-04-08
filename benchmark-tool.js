/**
 * 🛡️ uhbee: BNB Chain RPC Benchmark Tool (2026)
 * 🚀 Purpose: Compare latency between GetBlock and Competitor endpoints in the 0.45s Fermi Era.
 */

const axios = require('axios');

// CONFIGURATION: Replace these with your actual RPC URLs for local testing
const GETBLOCK_URL = "https://go.getblock.io/<YOUR-GETBLOCK-TOKEN>/";
const COMPETITOR_URL = "https://<COMPETITOR-RPC-URL>/";

/**
 * Executes a JSON-RPC call and measures the round-trip time (RTT).
 * @param {string} name - The name of the provider.
 * @param {string} url - The RPC endpoint URL.
 */
async function runLatencyTest(name, url) {
    if (url.includes("<YOUR-")) {
        console.log(`⚠️  Skipping ${name}: No valid URL provided.`);
        return;
    }

    const payload = {
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: Date.now()
    };

    console.log(`📡 Pinging ${name}...`);
    
    const start = performance.now();
    try {
        const response = await axios.post(url, payload, { timeout: 5000 });
        const end = performance.now();
        
        if (response.data.result) {
            const latency = (end - start).toFixed(2);
            console.log(`✅ ${name} Response: ${latency}ms | Block: ${parseInt(response.data.result, 16)}`);
            return parseFloat(latency);
        }
    } catch (error) {
        console.error(`❌ ${name} Failed: ${error.message}`);
    }
    return null;
}

/**
 * Main function to run the comparative audit.
 */
async function startAudit() {
    console.log("--- 🏗️ BNB Chain Infrastructure Audit v1.0 ---");
    
    const getBlockResult = await runLatencyTest("GetBlock", GETBLOCK_URL);
    const competitorResult = await runLatencyTest("Competitor", COMPETITOR_URL);

    if (getBlockResult && competitorResult) {
        const diff = (competitorResult - getBlockResult).toFixed(2);
        const improvement = (((competitorResult - getBlockResult) / competitorResult) * 100).toFixed(1);
        
        console.log("\n--- 📊 Final Verdict ---");
        if (getBlockResult < competitorResult) {
            console.log(`🚀 GetBlock is ${diff}ms faster (${improvement}% performance boost).`);
        } else {
            console.log("Competitor is currently faster in this local region.");
        }
    }
}

startAudit();
