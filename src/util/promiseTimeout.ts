export default function promiseTimeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}