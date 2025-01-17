import banks from "../helpers/banks.json";

export const datePreview = (date: string) => date?.split("T")[0];

export const rolePreview = (role: string) => {
    return role
        .split("_") // Split the string by underscores
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(" "); // Join the words with spaces
};

export const bankPreview = (code: string) => {
    const bank = banks.find((b) => b.ID === Number(code));
    return bank ? bank.name : "-";
};

export const amountPreview = (amount: number): string => {
    if (isNaN(amount)) {
        return "Rs. 0.00";
    }
    return `Rs. ${amount?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};
