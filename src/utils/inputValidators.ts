export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^(0(?:11|21|23|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|58|63|65|66|67|70|71|72|75|76|77|78|81|91|94|95)\d{6})$/;
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
