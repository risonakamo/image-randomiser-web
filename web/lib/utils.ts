// random util funcs

/** format time into: 2025-02-28 13:40:34 */
export function formatTime(time:number):string
{
    const date: Date = new Date(time);

    const pad = (n: number): string => n.toString().padStart(2, "0");

    const year: number = date.getFullYear();
    const month: string = pad(date.getMonth() + 1);
    const day: string = pad(date.getDate());
    const hours: string = pad(date.getHours());
    const minutes: string = pad(date.getMinutes());
    const seconds: string = pad(date.getSeconds());

    const formatted: string = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formatted;
}