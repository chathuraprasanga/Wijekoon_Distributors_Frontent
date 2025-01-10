export const hasPrivilege = (role: string, accessRole: string): boolean => {
    return role === accessRole;
};

export const hasAnyPrivilege = (role: string, accessRoles: any): boolean => {
    return accessRoles.includes(role);
};
