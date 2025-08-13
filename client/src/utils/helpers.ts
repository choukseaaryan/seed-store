export function classNames(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}
