let alerts: string[] = $state([]);

export const currentAlerts = {
  get() {
    return alerts;
  },
  set(value: string) {
    if (!alerts.includes(value)) {
      alerts.push(value);
    }

    setTimeout(() => {
      alerts = alerts.filter((alert) => alert !== value);
    }, 5000);
  },
};
