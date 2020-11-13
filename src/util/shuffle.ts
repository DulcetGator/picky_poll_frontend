export default function shuffle<A>(a: A[]): A[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[j];
    a[j] = a[i];
    a[i] = tmp;
  }

  return a;
}
