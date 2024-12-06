const toLocalTime = (date: Date): string => {
    const normalizedDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

    return normalizedDate.toISOString();
};

export default toLocalTime;
