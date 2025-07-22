export const errorState = $state({ errors: [] as string[] });

export function showError(message: string) {
  errorState.errors.push(message);
}

export function clearError(index: number) {
  errorState.errors.splice(index, 1);
}

export function clearAllErrors() {
  errorState.errors = [];
}
