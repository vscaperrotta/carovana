export function withTimeout(promise, ms = 12000, message = "La richiesta sta impiegando troppo tempo. Controlla la connessione e riprova.") {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    }),
  ]);
}
