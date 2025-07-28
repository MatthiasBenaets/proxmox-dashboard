let errors: string[] = $state([]);

export const currentErrors = {
  get() {
    return errors;
  },
  set(value: string) {
    if (!errors.includes(value)) {
      errors.push(value);
    }
  },
  clear(index: number) {
    errors.splice(index, 1);
  },
  clearAll() {
    errors = [];
  },
};
