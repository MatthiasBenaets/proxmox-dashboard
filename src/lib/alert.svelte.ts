export const alertState = $state({ alerts: [] as string[] });

export function showAlert(message: string) {
  if (!alertState.alerts.includes(message)) {
    alertState.alerts.push(message);
  }

  setTimeout(() => {
    alertState.alerts = alertState.alerts.filter((alert) => alert !== message);
  }, 5000);
}
