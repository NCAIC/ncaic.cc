export function open(url: string) {
    const win = window.open(url, "_blank");
    window.setTimeout(() => {
        win && (win.location = url);
    }, 50);
}
