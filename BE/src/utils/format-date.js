export function formatDateTime(date) {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: "Europe/Bucharest",
        hour12: false
    };
    return date.toLocaleString("ro-RO", options);
}