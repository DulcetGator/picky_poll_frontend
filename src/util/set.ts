export function shallowSetEquals<T>(a: Set<T>, b: Set<T>) {
    if (a.size != b.size) {
        return false;
    }
    for (const item of Array.from(a)) {
        if (!b.has(item)) {
            return false;
        }
    }
    return true;
}