
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const BASE_URL = 'http://localhost:3000';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORT_DIR = path.join(__dirname, '../reports');

async function generateReport() {
    console.log(chalk.blue('📊 Generating Performance Report...'));

    try {
        // Create reports directory if not exists
        if (!fs.existsSync(REPORT_DIR)) {
            fs.mkdirSync(REPORT_DIR);
        }

        // Fetch Metrics
        const metricsRes = await fetch(`${BASE_URL}/demo/metrics`);
        const healthRes = await fetch(`${BASE_URL}/health/ready`);
        const agentsRes = await fetch(`${BASE_URL}/agents`);

        if (!metricsRes.ok || !healthRes.ok || !agentsRes.ok) {
            throw new Error('Failed to fetch data from API');
        }

        const metrics = await metricsRes.json();
        const health = await healthRes.json();
        const agents = await agentsRes.json();

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `performance_report_${timestamp}.md`;
        const filepath = path.join(REPORT_DIR, filename);

        const content = `
# 📈 Hyper-Agent Swarm: Performance Report
**Generated At:** ${new Date().toLocaleString()}

## **1. System Health Status**
| Component | Status | Details |
| :--- | :--- | :--- |
| **Overall System** | ${health.status === 'ready' ? '✅ Operational' : '❌ Issues Found'} | Uptime: ${health.uptime?.toFixed(2)}s |
| **Redis Queue** | ${health.redis === 'connected' ? '✅ Connected' : '❌ Disconnected'} | Persistence Layer |
| **Database** | ${Array.isArray(agents.agents) ? '✅ Connected' : '❌ Error'} | Agent Definitions: ${agents.agents?.length || 0} |

## **2. Swarm Performance Metrics**
*   **Swarm State**: ${metrics.running ? '🟢 Running' : '⚪ Idle'}
*   **Started At**: ${metrics.startedAt ? new Date(metrics.startedAt).toLocaleString() : 'N/A'}
*   **Tasks Completed**: ${metrics.summary?.tasksCompleted || 0}
*   **Average Latency**: ${metrics.summary?.avgLatencyMs?.toFixed(2) || 0} ms
*   **Duration**: ${metrics.summary?.durationMs ? (metrics.summary.durationMs / 1000).toFixed(2) + 's' : 'N/A'}

## **3. Resource Utilization (Snapshot)**
| Metric | Value |
| :--- | :--- |
| **Memory Usage** | ${metrics.metrics?.[metrics.metrics.length - 1]?.memMB?.toFixed(2) || 'N/A'} MB |
| **FPS (Simulated)** | ${metrics.metrics?.[metrics.metrics.length - 1]?.fps?.toFixed(2) || 'N/A'} |

## **4. Recommendations**
${metrics.summary?.avgLatencyMs > 200 ? '- ⚠️ **Latency Warning**: Consider scaling worker nodes.' : '- ✅ **Latency Optimal**: System performing within SLAs.'}
${health.redis !== 'connected' ? '- 🚨 **CRITICAL**: Check Redis connection immediately.' : '- ✅ **Infrastructure**: Core services are stable.'}

---
*Report generated automatically by Hyper-Agent Swarm Monitoring Tool*
        `;

        fs.writeFileSync(filepath, content.trim());
        console.log(chalk.green(`✅ Report saved to: ${filepath}`));

    } catch (e: any) {
        console.error(chalk.red(`❌ Failed to generate report: ${e.message}`));
    }
}

generateReport();
