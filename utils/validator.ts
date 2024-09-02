export const validateCPF = (cpf: string) => {
  const cleanedCpf = cpf.replace(/[^\d]/g, ""); // Remove caracteres não numéricos
  if (cleanedCpf.length !== 11 || /^(\d)\1{10}$/.test(cleanedCpf)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanedCpf.charAt(i - 1)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanedCpf.charAt(9))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanedCpf.charAt(i - 1)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanedCpf.charAt(10))) return false;

  return true;
};

export const validatePhone = (phoneNumber: string) => {
  const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
  return phoneRegex.test(phoneNumber);
};
