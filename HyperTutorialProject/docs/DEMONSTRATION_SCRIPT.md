# 🚀 Hyper-Agent Swarm: Demonstration Script

## **1. Pre-Demo Checklist**
- [ ] **Server Status**: Ensure `npx tsx src/server.ts` is running (Port 3000).
- [ ] **Health Check**: Run `npx tsx tests/verification_protocol.ts` and confirm 100% PASS.
- [ ] **Browser**: Open `http://localhost:3000` in Chrome/Edge.
- [ ] **Metrics**: Ensure "Real-Time Analytics" section is visible.

---

## **2. Demonstration Sequence**

### **Phase 1: System Overview (2 mins)**
**Goal**: Introduce the architecture and components.
1.  **Navigate** to `http://localhost:3000`.
2.  **Highlight** the "Architecture" tab.
    *   Explain **MCP Protocol Layer** (The "HTTP for Agents").
    *   Explain **BullMQ + Redis** (Reliable Async Processing).
    *   Explain **Self-Verification** (Safety Agent).

### **Phase 2: The "Start Swarm" Event (3 mins)**
**Goal**: Show real-time agent coordination.
1.  **Click** the **"Start Swarm"** button.
2.  **Observe**:
    *   Toast notification: "Demo run started successfully".
    *   **Agent Grid**: Watch agents turn `online` (green status).
    *   **Logs**: Point out the live logs appearing in "Mission Control".
3.  **Narrative**: "Notice how the Orchestrator initializes the swarm. The metrics panel is updating in real-time, showing active agents and latency."

### **Phase 3: Deploying a Complex Workflow (5 mins)**
**Goal**: Show dynamic task allocation.
1.  **Click** **"Deploy Workflow"**.
2.  **Input Prompt**: Enter `"Design a scalable microservices architecture for a fintech app"`.
3.  **Observe**:
    *   Toast: "Workflow [ID] queued!".
    *   **Stats Box**: "Queued Jobs" count increases.
    *   **Logs**: Watch for "Workflow enqueued" message.
4.  **Narrative**: "We just injected a high-level goal. The Orchestrator will now decompose this into subtasks for the Researcher, Designer, and Coder agents."

### **Phase 4: Fault Tolerance & Self-Healing (Optional/Advanced)**
**Goal**: Demonstrate resilience.
1.  **Scenario**: Simulate a Redis blip.
2.  **Action**: (If terminal access available) `docker stop redis` (briefly) or simulate via code.
3.  **Observation**: The system should log a connection error but retry automatically (BullMQ exponential backoff).
4.  **Action**: Restart Redis.
5.  **Observation**: "System Health" returns to "Ready".

---

## **3. Backup Demonstration Scenarios**

### **Scenario A: Network/API Failure**
*   **Symptom**: "Start Swarm" button does nothing or times out.
*   **Workaround**:
    1.  Check terminal for server errors.
    2.  Use `curl -X POST http://localhost:3000/demo/run` to trigger backend directly.
    3.  Refresh dashboard to see updated state (State is persisted in memory/DB).

### **Scenario B: Visual Glitches**
*   **Symptom**: Agent grid not updating.
*   **Workaround**:
    1.  Hard refresh (Ctrl+F5).
    2.  Check `http://localhost:3000/demo/metrics` directly in a new tab to prove backend is working.

---

## **4. Monitoring & Metrics**

### **Live Dashboard (Primary)**
*   **URL**: `http://localhost:3000/#performance`
*   **Key Metrics**:
    *   **Active Agents**: Should match expected swarm size (8).
    *   **Avg Latency**: Should remain < 200ms for responsiveness.
    *   **Tasks Completed**: Should monotonically increase.

### **Performance Report Generation**
To generate a post-demo report:
```bash
npx tsx scripts/generate_report.ts
```
*   **Output**: `reports/performance_report_YYYY-MM-DD.md`
*   **Contains**: Uptime, Total Requests, Average Latency, Error Rate.
