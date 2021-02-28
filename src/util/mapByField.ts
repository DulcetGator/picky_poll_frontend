function mapByField<K, V>(vs: V[], f: ((v: V) => K)): Map<K, V>{
    const map = new Map();
    vs.forEach(value => {
        const key = f(value);
        map.set(key, value);
    })
    return map;
}


export default mapByField;