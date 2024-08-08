export function timestampToDate(timestamp: any) {
    const date = new Date(timestamp);

    // Check if the date is valid
    if (isNaN(date.getTime())) {       
        return ``;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
}
