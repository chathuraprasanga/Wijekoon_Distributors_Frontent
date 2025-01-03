
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^0\d{9}$/; // Matches numbers starting with 0 and exactly 10 digits
    return phoneRegex.test(phone);
};

export const isValidChequeNumber = (chequeNumber: string): boolean => {
    const chequeNumberRegex = /^\d{6}$/;
    return chequeNumberRegex.test(chequeNumber);
};

export const isValidBankCode = (bankCode: string): boolean => {
    const bankCodeRegex = /^\d{4}$/;
    return bankCodeRegex.test(bankCode);
};

export const isValidBranchCode = (branchCode: string): boolean => {
    const branchCodeRegex = /^\d{3}$/;
    return branchCodeRegex.test(branchCode);
};
