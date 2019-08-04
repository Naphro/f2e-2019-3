export function setTime(time) {
    const sec = Math.floor(time);
    const ss = sec % 60;
    const mm = Math.floor(sec / 60);
    return String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0')
}