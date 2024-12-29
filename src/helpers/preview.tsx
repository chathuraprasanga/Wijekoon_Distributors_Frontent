export const datePreview = (date: string) => date?.split("T")[0];

export const rolePreview = (role:string) => {
    return role
        .split("_") // Split the string by underscores
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(" "); // Join the words with spaces
};