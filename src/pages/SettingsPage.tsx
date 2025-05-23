import {
    Badge,
    Box,
    Button,
    Group,
    Menu,
    Modal,
    PasswordInput,
    ScrollArea,
    Select,
    Table,
    Text,
    TextInput,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store.ts";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { changePassword } from "../store/authSlice/authSlice.ts";
import toNotify from "../helpers/toNotify.tsx";
import {
    IconDotsVertical,
    IconEye,
    IconMobiledata,
    IconMobiledataOff,
    IconPlus,
} from "@tabler/icons-react";
import {
    addUser,
    changeStatusUser,
    getUsers,
} from "../store/userSlice/userSlice.ts";
import { useLoading } from "../helpers/loadingContext.tsx";
import { isValidEmail, isValidPhone } from "../utils/inputValidators.ts";
import { bankPreview, rolePreview } from "../helpers/preview.tsx";
import { rolesData } from "../utils/settings.ts";
import {
    addBankDetail,
    changeStatusBankDetail,
    getBankDetails,
} from "../store/bankDetailSlice/bankDetailSlice.ts";
import banks from "../helpers/banks.json";
import xcorpion from "../assets/xcorpion.png";
import { hasAnyPrivilege, hasPrivilege } from "../helpers/previlleges.ts";
import { USER_ROLES } from "../helpers/types.ts";
import {
    addWarehouse, changeStatusWarehouse,
    getWarehouses,
} from "../store/warehouseSlice/warehouseSlice.ts";

const SettingsPage = () => {
    const isSmallScreen = useMediaQuery("(max-width: 1024px)");
    const { setLoading } = useLoading();
    const user = useSelector((state: RootState) => state.auth.user);
    const role = user.role;
    const [passwordChangeModalOpened, passwordChangeHandler] =
        useDisclosure(false);
    const [usersViewOpened, handleUsersView] = useDisclosure(false);
    const [bankDetailsOpened, handleBankDetailsView] = useDisclosure(false);
    const [warehouseDetailsOpened, handleWarehouseDetailsView] =
        useDisclosure(false);
    const [adduserOpened, handleAddUser] = useDisclosure(false);
    const [addBankDetailOpened, handleAddBankDetail] = useDisclosure(false);
    const [addWarehouseDetailOpened, handleAddWarehouseDetail] =
        useDisclosure(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch | any>();
    const users = useSelector((state: RootState) => state.user.users);
    const bankDetails = useSelector(
        (state: RootState) => state.bankDetails.bankDetails
    );
    const warehouseDetails = useSelector(
        (state: RootState) => state.warehouses.warehouses
    );

    const bankList = banks.map((bank) => ({
        label: bank.name,
        value: bank.ID.toString(),
    }));

    useEffect(() => {
        if (hasAnyPrivilege(role, [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER])){
            getAllUsers();
            getAllBankDetails();
            getAllWarehouseDetails();
        }
    }, [dispatch]);

    const getAllUsers = async () => {
        setLoading(true);
        const response = await dispatch(getUsers({}));
        if (response.type === "user/getUsers/fulfilled") {
            setLoading(false);
        } else if (response.type === "user/getUsers/rejected") {
            setLoading(false);
            toNotify("Error", `${response.payload.error}`, "ERROR");
        } else {
            setLoading(false);
            toNotify("Warning", "Please contact system admin", "WARNING");
        }
    };

    const getAllBankDetails = async () => {
        setLoading(true);
        const response = await dispatch(getBankDetails({}));
        if (response.type === "bankDetail/getBankDetails/fulfilled") {
            setLoading(false);
        } else if (response.type === "bankDetail/getBankDetails/rejected") {
            setLoading(false);
            toNotify("Error", "Something went wrong", "ERROR");
        } else {
            setLoading(false);
            toNotify("Warning", "Please contact system admin", "WARNING");
        }
    };

    const getAllWarehouseDetails = async () => {
        setLoading(true);
        const response = await dispatch(getWarehouses({}));
        if (response.type === "warehouse/getWarehouses/fulfilled") {
            setLoading(false);
        } else if (response.type === "warehouse/getWarehouses/rejected") {
            setLoading(false);
            toNotify("Error", "Something went wrong", "ERROR");
        } else {
            setLoading(false);
            toNotify("Warning", "Please contact system admin", "WARNING");
        }
    };

    const pwForm = useForm({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validate: {
            currentPassword: (value) =>
                value ? null : "Current password is required",
            newPassword: (value) => (value ? null : "New password is required"),
            confirmPassword: (value, values) =>
                value === values.newPassword
                    ? null
                    : "New and confirm passwords do not match",
        },
    });

    const addUserForm = useForm({
        initialValues: {
            username: "",
            email: "",
            phone: "",
            role: "",
        },
        validate: {
            username: isNotEmpty("User name is required"),
            email: (value: any) => {
                if (!value) {
                    return "Email is required";
                }
                if (!isValidEmail(value)) {
                    return "Please enter valid email";
                }
                return null;
            },
            phone: (value: any) => {
                if (!value) {
                    return "Phone number is required";
                }
                if (!isValidPhone(value)) {
                    return "Please enter valid phone number";
                }
                return null;
            },
            role: isNotEmpty("Role is required"),
        },
    });

    const addBankDetailForm = useForm({
        initialValues: {
            bank: "",
            branch: "",
            accountNumber: "",
        },
        validate: {
            bank: isNotEmpty("Bank is required"),
            branch: isNotEmpty("Branch is required"),
            accountNumber: isNotEmpty("Account number is required"),
        },
    });

    const handlePasswordChange = async (values: typeof pwForm.values) => {
        setIsLoading(true);
        const response = await dispatch(changePassword(values));
        if (response.type === "auth/changePassword/fulfilled") {
            toNotify("Success", "Password changed successfully", "SUCCESS");
            setIsLoading(false);
            passwordChangeHandler.close();
            pwForm.reset();
        } else if (response.type === "auth/changePassword/rejected") {
            toNotify(
                "Error",
                `${response.payload.error || "Something went wrong"}`,
                "ERROR"
            );
            setIsLoading(false);
        } else {
            setIsLoading(false);
            toNotify(
                "Something went wrong",
                `Please contact system admin`,
                "WARNING"
            );
            passwordChangeHandler.close();
            pwForm.reset();
        }
    };

    const handleUserStatusChange = async (status: boolean, id: any) => {
        setLoading(true);
        const response = await dispatch(
            changeStatusUser({ values: { status: status }, id: id })
        );
        if (response.type === "user/changeStatus/fulfilled") {
            toNotify("Success", "User status changed successfully", "SUCCESS");
            handleUsersView.close();
            setLoading(false);
        } else if (response.type === "user/changeStatus/rejected") {
            toNotify(
                "Error",
                `${response.payload.error || "Something went wrong"}`,
                "ERROR"
            );
            setLoading(false);
        } else {
            setLoading(false);
            toNotify(
                "Something went wrong",
                `Please contact system admin`,
                "WARNING"
            );
            handleUsersView.close();
        }
    };

    const passwordChangeModal = () => (
        <Modal
            opened={passwordChangeModalOpened}
            onClose={() => {
                passwordChangeHandler.close();
                pwForm.reset();
                setIsLoading(false);
            }}
            title={<Text size="lg" fw="bold">Change Password</Text>}
        >
            <form onSubmit={pwForm.onSubmit(handlePasswordChange)}>
                <TextInput
                    label="Current Password"
                    type="password"
                    withAsterisk
                    placeholder="Enter current password"
                    {...pwForm.getInputProps("currentPassword")}
                />
                <PasswordInput
                    label="New Password"
                    mt="sm"
                    withAsterisk
                    placeholder="Enter new password"
                    {...pwForm.getInputProps("newPassword")}
                />
                <PasswordInput
                    label="Confirm New Password"
                    mt="sm"
                    withAsterisk
                    placeholder="Re-enter new password"
                    {...pwForm.getInputProps("confirmPassword")}
                />
                <Button
                    mt="md"
                    fullWidth
                    variant="filled"
                    type="submit"
                    loading={isLoading}
                >
                    Submit
                </Button>
            </form>
        </Modal>
    );

    const viewUsersModal = () => (
        <Modal
            opened={usersViewOpened}
            onClose={handleUsersView.close}
            title={
                <Text size="lg" fw="bold">
                    Users
                </Text>
            }
            size={isSmallScreen ? "100%" : "70%"}
            className="max-h-80"
        >
            <ScrollArea className="overflow-x-auto">
                <Table className="min-w-full" highlightOnHover>
                    <Table.Thead>
                        <Table.Tr className="bg-gray-100 hidden sm:table-row">
                            <Table.Th className="px-2 py-2 text-sm sm:text-base">
                                Username
                            </Table.Th>
                            <Table.Th className="px-2 py-2 text-sm sm:text-base">
                                Email
                            </Table.Th>
                            <Table.Th className="px-2 py-2 text-sm sm:text-base">
                                Phone
                            </Table.Th>
                            <Table.Th className="px-2 py-2 text-sm sm:text-base">
                                Role
                            </Table.Th>
                            <Table.Th className="px-2 py-2 text-sm sm:text-base">
                                Status
                            </Table.Th>
                            <Table.Th className="px-2 py-2 text-sm sm:text-base">
                                Actions
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {users?.map((u: any, index: any) => (
                            <Table.Tr
                                key={index}
                                className="sm:table-row flex flex-col sm:flex-row mb-4 sm:mb-0 border-b sm:border-none"
                            >
                                <Table.Td className="px-2 py-2 sm:w-1/6 text-sm truncate whitespace-nowrap">
                                    <span className="sm:hidden font-semibold w-1/4">
                                        Username:
                                    </span>{" "}
                                    {u?.username}
                                </Table.Td>
                                <Table.Td className="px-2 py-2 sm:w-1/4 text-sm truncate whitespace-nowrap">
                                    <span className="sm:hidden font-semibold">
                                        Email:
                                    </span>{" "}
                                    {u?.email}
                                </Table.Td>
                                <Table.Td className="px-2 py-2 sm:w-1/6 text-sm truncate whitespace-nowrap">
                                    <span className="sm:hidden font-semibold">
                                        Phone:
                                    </span>{" "}
                                    {u?.phone}
                                </Table.Td>
                                <Table.Td className="px-2 py-2 sm:w-1/6 text-sm truncate whitespace-nowrap">
                                    <span className="sm:hidden font-semibold">
                                        Role:
                                    </span>
                                    <Badge
                                        variant="dot"
                                        color={
                                            rolesData.find(
                                                (role) => role.value === u?.role
                                            )?.color || "gray"
                                        }
                                        className="truncate whitespace-nowrap"
                                    >
                                        {rolePreview(u?.role) ?? "-"}
                                    </Badge>
                                </Table.Td>
                                <Table.Td className="px-2 py-2 sm:w-1/6 text-sm truncate whitespace-nowrap">
                                    <span className="sm:hidden font-semibold">
                                        Status:
                                    </span>
                                    {u?.status ? (
                                        <Badge
                                            color="green"
                                            radius="xs"
                                            size="sm"
                                            className="truncate whitespace-nowrap"
                                        >
                                            ACTIVE
                                        </Badge>
                                    ) : (
                                        <Badge
                                            color="red"
                                            radius="xs"
                                            size="sm"
                                            className="truncate whitespace-nowrap"
                                        >
                                            INACTIVE
                                        </Badge>
                                    )}
                                </Table.Td>
                                {hasPrivilege(
                                    user.role,
                                    USER_ROLES.SUPER_ADMIN
                                ) &&
                                    u.role !== USER_ROLES.SUPER_ADMIN && (
                                        <Table.Td className="px-2 py-2 sm:w-1/6 text-sm truncate whitespace-nowrap">
                                            <Menu>
                                                <Menu.Target>
                                                    <IconDotsVertical
                                                        size={16}
                                                        className="cursor-pointer"
                                                    />
                                                </Menu.Target>
                                                <Menu.Dropdown>
                                                    <Menu.Label>
                                                        Actions
                                                    </Menu.Label>
                                                    <Menu.Item
                                                        color={
                                                            u?.status
                                                                ? "red"
                                                                : "green"
                                                        }
                                                        variant="light"
                                                        leftSection={
                                                            u?.status ? (
                                                                <IconMobiledataOff
                                                                    size={16}
                                                                />
                                                            ) : (
                                                                <IconMobiledata
                                                                    size={16}
                                                                />
                                                            )
                                                        }
                                                        onClick={() =>
                                                            handleUserStatusChange(
                                                                !u.status,
                                                                u._id
                                                            )
                                                        }
                                                    >
                                                        {u.status
                                                            ? "Deactivate"
                                                            : "Activate"}
                                                    </Menu.Item>
                                                </Menu.Dropdown>
                                            </Menu>
                                        </Table.Td>
                                    )}
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </ScrollArea>
        </Modal>
    );

    const changeBankDetailStatus = async (status: boolean, id: any) => {
        setLoading(true);
        const response = await dispatch(
            changeStatusBankDetail({ values: { status: !status }, id: id })
        );
        if (response.type === "bankDetail/changeStatusBankDetail/fulfilled") {
            toNotify(
                "Success",
                "Bank detail status changed successfully",
                "SUCCESS"
            );
            handleBankDetailsView.close();
            setLoading(false);
        } else if (response.type === "user/changeStatusBankDetail/rejected") {
            toNotify(
                "Error",
                `${response.payload.error || "Something went wrong"}`,
                "ERROR"
            );
            setLoading(false);
        } else {
            setLoading(false);
            toNotify(
                "Something went wrong",
                `Please contact system admin`,
                "WARNING"
            );
            handleBankDetailsView.close();
        }
    };

    const viewBankDetailsModal = () => (
        <Modal
            opened={bankDetailsOpened}
            onClose={handleBankDetailsView.close}
            title={<Text size="lg" fw="bold">Bank Account Details</Text>}
            size={isSmallScreen ? "100%" : "70%"}
            className="max-h-80"
        >
            <ScrollArea className="overflow-x-auto">
                <Table className="min-w-full" highlightOnHover>
                    <Table.Thead>
                        <Table.Tr className="bg-gray-100 hidden sm:table-row">
                            <Table.Th className="px-2 py-2 text-sm sm:text-base">
                                Bank Name
                            </Table.Th>
                            <Table.Th className="px-2 py-2 text-sm sm:text-base">
                                Branch
                            </Table.Th>
                            <Table.Th className="px-2 py-2 text-sm sm:text-base">
                                Account Number
                            </Table.Th>
                            <Table.Th className="px-2 py-2 text-sm sm:text-base">
                                Status
                            </Table.Th>
                            <Table.Th className="px-2 py-2 text-sm sm:text-base">
                                Actions
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {bankDetails?.map((bd: any, index: any) => (
                            <Table.Tr
                                key={index}
                                className="sm:table-row flex flex-col sm:flex-row mb-4 sm:mb-0 border-b sm:border-none"
                            >
                                <Table.Td className="px-2 py-2 sm:w-1/6 text-sm truncate whitespace-nowrap">
                                    <span className="sm:hidden font-semibold w-1/4">
                                        Bank:
                                    </span>{" "}
                                    {bankPreview(bd?.bank)}
                                </Table.Td>
                                <Table.Td className="px-2 py-2 sm:w-1/4 text-sm truncate whitespace-nowrap">
                                    <span className="sm:hidden font-semibold">
                                        Branch:
                                    </span>{" "}
                                    {bd?.branch}
                                </Table.Td>
                                <Table.Td className="px-2 py-2 sm:w-1/6 text-sm truncate whitespace-nowrap">
                                    <span className="sm:hidden font-semibold">
                                        Account Number:
                                    </span>{" "}
                                    {bd?.accountNumber}
                                </Table.Td>
                                <Table.Td className="px-2 py-2 sm:w-1/6 text-sm truncate whitespace-nowrap">
                                    <span className="sm:hidden font-semibold">
                                        Status:
                                    </span>
                                    {bd?.status ? (
                                        <Badge
                                            color="green"
                                            radius="xs"
                                            size="sm"
                                            className="truncate whitespace-nowrap"
                                        >
                                            ACTIVE
                                        </Badge>
                                    ) : (
                                        <Badge
                                            color="red"
                                            radius="xs"
                                            size="sm"
                                            className="truncate whitespace-nowrap"
                                        >
                                            INACTIVE
                                        </Badge>
                                    )}
                                </Table.Td>
                                <Table.Td className="px-2 py-2 sm:w-1/6 text-sm truncate whitespace-nowrap">
                                    <Menu>
                                        <Menu.Target>
                                            <IconDotsVertical
                                                size={16}
                                                className="cursor-pointer"
                                            />
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Label>Actions</Menu.Label>
                                            <Menu.Item
                                                color={
                                                    bd?.status ? "red" : "green"
                                                }
                                                variant="light"
                                                leftSection={
                                                    bd?.status ? (
                                                        <IconMobiledataOff
                                                            size={16}
                                                        />
                                                    ) : (
                                                        <IconMobiledata
                                                            size={16}
                                                        />
                                                    )
                                                }
                                                onClick={() =>
                                                    changeBankDetailStatus(
                                                        bd?.status,
                                                        bd?._id
                                                    )
                                                }
                                            >
                                                {bd?.status
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </ScrollArea>
        </Modal>
    );

    const handleAddUseForm = async (values: typeof addUserForm.values) => {
        setIsLoading(true);
        const response = await dispatch(addUser(values));
        if (response.type === "user/addUser/fulfilled") {
            setIsLoading(false);
            await dispatch(getUsers({}));
            toNotify("Success", "User created successfully", "SUCCESS");
            addUserForm.reset();
            handleAddUser.close();
        } else if (response.type === "user/addUser/rejected") {
            setIsLoading(false);
            toNotify("Error",` ${response.payload.error}`, "ERROR");
        } else {
            setIsLoading(false);
            toNotify("Warning", "Please contact system admin", "WARNING");
        }
    };

    const adduserOpenedModal = () => (
        <Modal
            opened={adduserOpened}
            onClose={() => {
                handleAddUser.close();
                addUserForm.reset();
            }}
            title={<Text size="lg" fw="bold">Add Users</Text>}
        >
            <form onSubmit={addUserForm.onSubmit(handleAddUseForm)}>
                <TextInput
                    label="User Name"
                    placeholder="Enter username"
                    withAsterisk
                    {...addUserForm.getInputProps("username")}
                />
                <TextInput
                    label="Email"
                    mt="sm"
                    placeholder="Enter email"
                    withAsterisk
                    {...addUserForm.getInputProps("email")}
                />
                <TextInput
                    label="Phone"
                    mt="sm"
                    type="number"
                    placeholder="Enter phone"
                    withAsterisk
                    {...addUserForm.getInputProps("phone")}
                />
                <Select
                    label="Role"
                    mt="sm"
                    data={rolesData}
                    placeholder="Select role"
                    withAsterisk
                    {...addUserForm.getInputProps("role")}
                />
                <Button
                    mt="md"
                    fullWidth
                    variant="filled"
                    type="submit"
                    loading={isLoading}
                >
                    Submit
                </Button>
            </form>
        </Modal>
    );

    const addBankDetailModal = () => (
        <Modal
            opened={addBankDetailOpened}
            onClose={() => {
                handleAddBankDetail.close();
                addBankDetailForm.reset();
            }}
            title={<Text size="lg" fw="bold">Add Bank Detail</Text>}
        >
            <form
                onSubmit={addBankDetailForm.onSubmit(handleAddBankDetailForm)}
            >
                <Select
                    label="Bank"
                    placeholder="Choose a bank"
                    data={bankList}
                    searchable
                    {...addBankDetailForm.getInputProps("bank")}
                />
                <TextInput
                    label="Branch"
                    placeholder="Type your branch"
                    {...addBankDetailForm.getInputProps("branch")}
                />
                <TextInput
                    label="Account Number"
                    mt="sm"
                    placeholder="Enter accoun number"
                    {...addBankDetailForm.getInputProps("accountNumber")}
                />
                <Button
                    mt="md"
                    fullWidth
                    variant="filled"
                    type="submit"
                    loading={isLoading}
                >
                    Submit
                </Button>
            </form>
        </Modal>
    );

    const handleAddBankDetailForm = async (
        values: typeof addBankDetailForm.values
    ) => {
        setIsLoading(true);
        const response = await dispatch(addBankDetail(values));
        if (response.type === "bankDetail/addBankDetail/fulfilled") {
            setIsLoading(false);
            await dispatch(getBankDetails({}));
            toNotify("Success", "Bank detail created successfully", "SUCCESS");
            addBankDetailForm.reset();
            handleAddBankDetail.close();
        } else if (response.type === "bankDetail/addBankDetail/rejected") {
            setIsLoading(false);
            toNotify("Error", "Bank detail created failed", "ERROR");
        } else {
            setIsLoading(false);
            toNotify("Warning", "Please contact system admin", "WARNING");
        }
    };

    const warehouseAddForm = useForm({
        initialValues: {
            city: "",
        },
        validate: {
            city: isNotEmpty("City is required."),
        },
    });

    const addWarehouseModal = () => (
        <Modal
            opened={addWarehouseDetailOpened}
            onClose={() => {
                handleAddWarehouseDetail.close();
                warehouseAddForm.reset();
            }}
            title={<Text size="lg" fw="bold">Add Warehouse Detail</Text>}
        >
            <form
                onSubmit={warehouseAddForm.onSubmit(
                    handleAddWarehouseDetailForm
                )}
            >
                <TextInput
                    label="City"
                    placeholder="Enter warehouse city"
                    withAsterisk
                    {...warehouseAddForm.getInputProps("city")}
                />
                <Button mt="md" fullWidth loading={isLoading} type="submit">
                    Submit
                </Button>
            </form>
        </Modal>
    );

    const handleAddWarehouseDetailForm = async (
        values: typeof warehouseAddForm.values
    ) => {
        setIsLoading(true);
        const response = await dispatch(addWarehouse(values));
        if (response.type === "warehouse/addWarehouse/fulfilled") {
            setIsLoading(false);
            await dispatch(getWarehouses({}));
            toNotify("Success", "Warehouse created successfully", "SUCCESS");
            warehouseAddForm.reset();
            handleAddWarehouseDetail.close();
        } else if (response.type === "warehouse/addWarehouse/rejected") {
            setIsLoading(false);
            toNotify("Error", `${response.payload.error}`, "ERROR");
        } else {
            setIsLoading(false);
            toNotify("Warning", "Please contact system admin", "WARNING");
        }
    };

    const viewWarehouseModal = () => (
        <Modal
            opened={warehouseDetailsOpened}
            onClose={handleWarehouseDetailsView.close}
            title={<Text size="lg" fw="bold">Warehouse Details</Text>}
            size={isSmallScreen ? "100%" : "lg"}
        >
            <ScrollArea className="overflow-x-auto">
                <Table className="min-w-full" highlightOnHover>
                    <Table.Thead>
                        <Table.Tr className="bg-gray-100 hidden sm:table-row">
                            <Table.Th className="px-2 py-2 text-sm sm:text-base">
                                Warehouse Id
                            </Table.Th>
                            <Table.Th className="px-2 py-2 text-sm sm:text-base">
                                City
                            </Table.Th>{" "}
                            <Table.Th className="px-2 py-2 text-sm sm:text-base">
                                Status
                            </Table.Th>
                            <Table.Th className="px-2 py-2 text-sm sm:text-base">
                                Actions
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {warehouseDetails?.map((wd: any, index: any) => (
                            <Table.Tr
                                key={index}
                                className="sm:table-row flex flex-col sm:flex-row mb-4 sm:mb-0 border-b sm:border-none"
                            >
                                <Table.Td className="px-2 py-2 sm:w-1/6 text-sm truncate whitespace-nowrap">
                                    <span className="sm:hidden font-semibold w-1/4">
                                        Warehouse Id:
                                    </span>{" "}
                                    {wd.id}
                                </Table.Td>
                                <Table.Td className="px-2 py-2 sm:w-1/4 text-sm truncate whitespace-nowrap">
                                    <span className="sm:hidden font-semibold">
                                        City:
                                    </span>{" "}
                                    {wd?.city}
                                </Table.Td>
                                <Table.Td className="px-2 py-2 sm:w-1/6 text-sm truncate whitespace-nowrap">
                                    <span className="sm:hidden font-semibold">
                                        Status:
                                    </span>
                                    {wd?.status ? (
                                        <Badge
                                            color="green"
                                            radius="xs"
                                            size="sm"
                                            className="truncate whitespace-nowrap"
                                        >
                                            ACTIVE
                                        </Badge>
                                    ) : (
                                        <Badge
                                            color="red"
                                            radius="xs"
                                            size="sm"
                                            className="truncate whitespace-nowrap"
                                        >
                                            INACTIVE
                                        </Badge>
                                    )}
                                </Table.Td>
                                <Table.Td className="px-2 py-2 sm:w-1/6 text-sm truncate whitespace-nowrap">
                                    <Menu>
                                        <Menu.Target>
                                            <IconDotsVertical
                                                size={16}
                                                className="cursor-pointer"
                                            />
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Label>Actions</Menu.Label>
                                            <Menu.Item
                                                color={
                                                    wd?.status ? "red" : "green"
                                                }
                                                variant="light"
                                                leftSection={
                                                    wd?.status ? (
                                                        <IconMobiledataOff
                                                            size={16}
                                                        />
                                                    ) : (
                                                        <IconMobiledata
                                                            size={16}
                                                        />
                                                    )
                                                }
                                                onClick={() =>
                                                    changeWarehouseDetailStatus(
                                                        wd?.status,
                                                        wd?._id
                                                    )
                                                }
                                            >
                                                {wd?.status
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </ScrollArea>
        </Modal>
    );

    const changeWarehouseDetailStatus = async (status: boolean, id: any) => {
        setLoading(true);
        const response = await dispatch(
            changeStatusWarehouse({ values: { status: !status }, id: id })
        );
        if (response.type === "warehouse/changeStatus/fulfilled") {
            toNotify(
                "Success",
                "Warehouse status changed successfully",
                "SUCCESS"
            );
            handleWarehouseDetailsView.close();
            setLoading(false);
        } else if (response.type === "warehouse/changeStatus/rejected") {
            toNotify(
                "Error",
                `${response.payload.error || "Something went wrong"}`,
                "ERROR"
            );
            setLoading(false);
        } else {
            setLoading(false);
            toNotify(
                "Something went wrong",
                `Please contact system admin`,
                "WARNING"
            );
            handleWarehouseDetailsView.close();
        }
    };

    return (
        <>
            {/* Header */}
            <Box display="flex" p="lg" className="items-center justify-between">
                <Box>
                    <Text size="lg" fw={500}>
                        Settings
                    </Text>
                </Box>
            </Box>
            <Box px="lg" mb="lg" className="space-y-1">
                {/* Username + Change Password */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Text className="w-full sm:w-1/4 text-sm">Username:</Text>
                    <Text className="w-full sm:w-2/4 text-sm">{user?.username}</Text>
                    <Button
                        size="xs"
                        variant="light"
                        className="w-full sm:w-auto sm:ml-auto"
                        onClick={passwordChangeHandler.open}
                    >
                        Change Password
                    </Button>
                </div>
                <hr />

                {/* Mobile Number */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Text className="w-full sm:w-1/4 text-sm">Mobile Number:</Text>
                    <Text className="w-full sm:w-3/4 text-sm">{user?.phone}</Text>
                </div>
                <hr />

                {/* Email */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Text className="w-full sm:w-1/4 text-sm">Email:</Text>
                    <Text className="w-full sm:w-3/4 text-sm">{user?.email}</Text>
                </div>
                <hr />

                {/* Role */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Text className="w-full sm:w-1/4 text-sm">Role:</Text>
                    <Text className="w-full sm:w-3/4 text-sm">{rolePreview(user?.role) || "-"}</Text>
                </div>
                <hr />
            </Box>

            {hasAnyPrivilege(role, [
                USER_ROLES.OWNER,
                USER_ROLES.ADMIN,
                USER_ROLES.SUPER_ADMIN,
            ]) && (
                <>
                    <Box
                        display="flex"
                        p="lg"
                        className="items-center justify-between"
                    >
                        <Box>
                            <Text size="lg" fw={500}>
                                Users
                            </Text>
                        </Box>
                    </Box>
                    <Box px="lg" mb="lg" className="gap-1">
                        <div className="flex gap-2 flex-row sm:flex-row items-start sm:items-center mb-2">
                            <Button
                                size="xs"
                                variant="light"
                                color="violet"
                                className="w-full sm:w-auto"
                                onClick={handleUsersView.open}
                                leftSection={<IconEye size={16} />}
                            >
                                View Users
                            </Button>
                            {role === "super_admin" && (
                                <Button
                                    size="xs"
                                    variant="light"
                                    className="w-full sm:w-auto"
                                    onClick={handleAddUser.open}
                                    leftSection={<IconPlus size={16} />}
                                >
                                    Add User
                                </Button>
                            )}
                        </div>
                        <hr />
                    </Box>
                </>
            )}

            {hasAnyPrivilege(role, [
                USER_ROLES.OWNER,
                USER_ROLES.ADMIN,
                USER_ROLES.SUPER_ADMIN,
            ]) && (
                <>
                    <Box
                        display="flex"
                        p="lg"
                        className="items-center justify-between"
                    >
                        <Box>
                            <Text size="lg" fw={500}>
                                Bank Details
                            </Text>
                        </Box>
                    </Box>
                    <Box px="lg" mb="lg" className="gap-1">
                        <div className="flex gap-2 flex-row sm:flex-row items-start sm:items-center mb-2">
                            <Button
                                size="xs"
                                variant="light"
                                color="violet"
                                className="w-full sm:w-auto"
                                onClick={handleBankDetailsView.open}
                                leftSection={<IconEye size={16} />}
                            >
                                View Bank Details
                            </Button>
                            {role === "super_admin" && (
                                <Button
                                    size="xs"
                                    variant="light"
                                    className="w-full sm:w-auto"
                                    onClick={handleAddBankDetail.open}
                                    leftSection={<IconPlus size={16} />}
                                >
                                    Add Bank Details
                                </Button>
                            )}
                        </div>
                        <hr />
                    </Box>
                </>
            )}

            {hasAnyPrivilege(role, [
                USER_ROLES.OWNER,
                USER_ROLES.ADMIN,
                USER_ROLES.SUPER_ADMIN,
                USER_ROLES.WAREHOUSE_MANAGER,
            ]) && (
                <>
                    <Box
                        display="flex"
                        p="lg"
                        className="items-center justify-between"
                    >
                        <Box>
                            <Text size="lg" fw={500}>
                                Warehouse Details
                            </Text>
                        </Box>
                    </Box>
                    <Box px="lg" mb="lg" className="gap-1">
                        <div className="flex gap-2 flex-row sm:flex-row items-start sm:items-center mb-2">
                            <Button
                                size="xs"
                                variant="light"
                                color="violet"
                                className="w-full sm:w-auto"
                                onClick={handleWarehouseDetailsView.open}
                                leftSection={<IconEye size={16} />}
                            >
                                View Warehouse Details
                            </Button>
                            {hasAnyPrivilege(user.role, [
                                USER_ROLES.SUPER_ADMIN,
                                USER_ROLES.OWNER,
                                USER_ROLES.WAREHOUSE_MANAGER,
                            ]) && (
                                <Button
                                    size="xs"
                                    variant="light"
                                    className="w-full sm:w-auto"
                                    onClick={handleAddWarehouseDetail.open}
                                    leftSection={<IconPlus size={16} />}
                                >
                                    Add Warehouse
                                </Button>
                            )}
                        </div>
                        <hr />
                    </Box>
                </>
            )}

            <Group
                className="mt-4 flex flex-row items-center gap-4 border w-fit px-2 py-2 cursor-pointer mx-4 my-4"
                onClick={() => window.open("https://xcorpion.xyz", "_blank")}
            >
                <img src={xcorpion} className="w-6" />
                <Text>XCORPION</Text>
            </Group>

            {passwordChangeModal()}
            {viewUsersModal()}
            {adduserOpenedModal()}
            {viewBankDetailsModal()}
            {addBankDetailModal()}
            {addWarehouseModal()}
            {viewWarehouseModal()}
        </>
    );
};

export default SettingsPage;
