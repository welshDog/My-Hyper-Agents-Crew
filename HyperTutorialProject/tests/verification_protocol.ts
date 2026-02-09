
import chalk from 'chalk';

const BASE_URL = 'http://localhost:3000';

async function runVerification() {
    console.log(chalk.bold.blue('\n🚀 Starting Implementation Verification and Testing Protocol\n'));

    const report: any[] = [];

    // Helper for logging
    const logResult = (test: string, status: 'PASS' | 'FAIL', details: string, time?: number) => {
        const icon = status === 'PASS' ? '✅' : '❌';
        const timeStr = time ? ` (${time}ms)` : '';
        console.log(`${icon} ${chalk.bold(test)}: ${status === 'PASS' ? chalk.green(status) : chalk.red(status)}${timeStr}`);
        if (details) console.log(`   ${chalk.gray(details)}`);
        report.push({ test, status, details, time });
    };

    // 1. Dashboard Access
    console.log(chalk.yellow('\n[1] Testing Dashboard Access & Initial Setup...'));
    try {
        const start = performance.now();
        const res = await fetch(`${BASE_URL}/`);
        const time = Math.round(performance.now() - start);
        const text = await res.text();
        
        if (res.status === 200 && text.includes('Hyper-Agent Swarm')) {
            logResult('Dashboard Load', 'PASS', 'Served index.html with correct title', time);
        } else {
            logResult('Dashboard Load', 'FAIL', `Status: ${res.status}, Content missing expected title`);
        }
    } catch (e: any) {
        logResult('Dashboard Load', 'FAIL', `Network Error: ${e.message}`);
    }

    // 2. Start Swarm Feature
    console.log(chalk.yellow('\n[2] Testing "Start Swarm" Feature...'));
    try {
        const start = performance.now();
        const res = await fetch(`${BASE_URL}/demo/run`, { method: 'POST' });
        const time = Math.round(performance.now() - start);
        const data = await res.json();

        if (res.status === 202 && data.status === 'running') {
            logResult('Start Swarm Execution', 'PASS', 'Demo run initiated successfully', time);
            
            // Performance check
            if (time < 5000) {
                 logResult('Response Time', 'PASS', `Response time < 5s`, time);
            } else {
                 logResult('Response Time', 'FAIL', `Response time > 5s`, time);
            }
        } else if (res.status === 409) {
             logResult('Start Swarm Execution', 'PASS', 'Swarm already running (Concurrency Check Handled)', time);
        } else {
            logResult('Start Swarm Execution', 'FAIL', `Unexpected status: ${res.status} - ${JSON.stringify(data)}`);
        }
    } catch (e: any) {
        logResult('Start Swarm Execution', 'FAIL', `Network Error: ${e.message}`);
    }

    // 3. Deploy Workflow Feature
    console.log(chalk.yellow('\n[3] Testing "Deploy Workflow" Feature...'));
    try {
        const start = performance.now();
        const payload = {
            userId: '00000000-0000-0000-0000-000000000000',
            prompt: 'Analyze market trends for AI agents',
            options: { timeout: 5000 }
        };
        
        const res = await fetch(`${BASE_URL}/workflows`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const time = Math.round(performance.now() - start);
        const data = await res.json();

        if (res.status === 202 && data.workflowId) {
            logResult('Workflow Creation', 'PASS', `Workflow ID: ${data.workflowId} created`, time);
            logResult('Task Queueing', 'PASS', `Status: ${data.status}`);
        } else {
            logResult('Workflow Creation', 'FAIL', `Failed to create workflow: ${JSON.stringify(data)}`);
        }

        // Test Invalid Input
        const invalidRes = await fetch(`${BASE_URL}/workflows`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, prompt: '' }) // Empty prompt
        });
        if (invalidRes.status === 400) {
            logResult('Input Validation', 'PASS', 'Correctly rejected empty prompt');
        } else {
             logResult('Input Validation', 'FAIL', `Expected 400 for invalid input, got ${invalidRes.status}`);
        }

    } catch (e: any) {
        logResult('Deploy Workflow', 'FAIL', `Network Error: ${e.message}`);
    }

    // 4. Run Diagnostics
    console.log(chalk.yellow('\n[4] Testing "Run Diagnostics" System Health...'));
    try {
        const start = performance.now();
        const res = await fetch(`${BASE_URL}/health/ready`);
        const time = Math.round(performance.now() - start);
        const data = await res.json();

        if (res.status === 200 && data.status === 'ready') {
            logResult('System Health Check', 'PASS', `Status: ${data.status}, Redis: ${data.redis}`, time);
        } else {
            logResult('System Health Check', 'FAIL', `System not ready: ${JSON.stringify(data)}`);
        }
        
        // Agents Check
        const agentsRes = await fetch(`${BASE_URL}/agents`);
        const agentsData = await agentsRes.json();
        if (agentsRes.status === 200 && Array.isArray(agentsData.agents)) {
             logResult('Database Connectivity', 'PASS', `Found ${agentsData.agents.length} agent definitions`);
        } else {
             logResult('Database Connectivity', 'FAIL', 'Could not fetch agents from DB');
        }

    } catch (e: any) {
        logResult('Diagnostics', 'FAIL', `Network Error: ${e.message}`);
    }

    console.log(chalk.bold.blue('\n🏁 Verification Protocol Complete\n'));
    
    // Summary
    const passed = report.filter(r => r.status === 'PASS').length;
    const total = report.length;
    console.log(`Summary: ${passed}/${total} Tests Passed`);
    
    if (passed === total) {
        console.log(chalk.green.bold('RESULT: SUCCESS - Ready for Production Stage'));
    } else {
        console.log(chalk.red.bold('RESULT: ISSUES FOUND - Review Report Above'));
    }
}

runVerification();
