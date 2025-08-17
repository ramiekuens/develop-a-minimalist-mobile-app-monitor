interface MonitorAppConfig {
  appId: string;
  apiEndpoint: string;
  refreshInterval: number; // in seconds
}

interface AppMonitorData {
  cpuUsage: number;
  memoryUsage: number;
  networkUsage: number;
  errors: string[];
}

class AppMonitor {
  private config: MonitorAppConfig;
  private data: AppMonitorData;

  constructor(config: MonitorAppConfig) {
    this.config = config;
    this.data = {
      cpuUsage: 0,
      memoryUsage: 0,
      networkUsage: 0,
      errors: [],
    };
  }

  async startMonitoring() {
    setInterval(async () => {
      try {
        const response = await fetch(`${this.config.apiEndpoint}/monitor`);
        const newData = await response.json();
        this.updateData(newData);
      } catch (error) {
        this.data.errors.push(error.message);
      }
    }, this.config.refreshInterval * 1000);
  }

  private updateData(newData: AppMonitorData) {
    this.data = { ...this.data, ...newData };
  }

  getData(): AppMonitorData {
    return this.data;
  }
}

const appMonitor = new AppMonitor({
  appId: 'my-app',
  apiEndpoint: 'https://api.example.com',
  refreshInterval: 10,
});

appMonitor.startMonitoring();

// render the data in a minimalistic UI
function renderData(data: AppMonitorData) {
  const container = document.getElementById('monitor-container');
  container.innerHTML = `
    <h2>CPU Usage: ${data.cpuUsage}%</h2>
    <h2>Memory Usage: ${data.memoryUsage}%</h2>
    <h2>Network Usage: ${data.networkUsage}%</h2>
    <h2>Errors: ${data.errors.length}</h2>
    <ul>
      ${data.errors.map((error) => `<li>${error}</li>`).join('')}
    </ul>
  `;
}

setInterval(() => {
  const data = appMonitor.getData();
  renderData(data);
}, 1000);