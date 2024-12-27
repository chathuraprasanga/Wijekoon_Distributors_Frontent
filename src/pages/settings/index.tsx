import {
    Badge,
    Box,
    Button,
    Menu,
    Modal,
    PasswordInput,
    ScrollArea,
    Table,
    Text,
    TextInput,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { changePassword } from "../../store/authSlice/authSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";
import {
    IconDotsVertical,
    IconEye,
    IconMobiledata,
    IconMobiledataOff,
    IconPlus,
} from "@tabler/icons-react";
import { addUser, getUsers } from "../../store/userSlice/userSlice.ts";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { isValidEmail, isValidPhone } from "../../utils/inputValidators.ts";

const Settings = () => {
    const isSmallScreen = useMediaQuery("(max-width: 1024px)");
    const { setLoading } = useLoading();
    const user = useSelector((state: RootState) => state.auth.user);
    const [passwordChangeModalOpened, passwordChangeHandler] =
        useDisclosure(false);
    const [usersViewOpened, handleUsersView] = useDisclosure(false);
    const [adduserOpened, handleAddUser] = useDisclosure(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch | any>();
    const users = useSelector((state: RootState) => state.user.users);

    useEffect(() => {
        getAllUsers();
    }, [dispatch]);

    const getAllUsers = async () => {
        setLoading(true);
        const response = await dispatch(getUsers({}));
        if (response.type === "user/getUsers/fulfilled") {
            setLoading(false);
        } else if (response.type === "user/getUsers/rejected") {
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

    const passwordChangeModal = () => (
        <Modal
            opened={passwordChangeModalOpened}
            onClose={() => {
                passwordChangeHandler.close();
                pwForm.reset();
                setIsLoading(false);
            }}
            title={<Text size="lg">Change Password</Text>}
            centered
        >
            <form onSubmit={pwForm.onSubmit(handlePasswordChange)}>
                <TextInput
                    label="Current Password"
                    type="password"
                    placeholder="Enter current password"
                    {...pwForm.getInputProps("currentPassword")}
                />
                <PasswordInput
                    label="New Password"
                    mt="sm"
                    placeholder="Enter new password"
                    {...pwForm.getInputProps("newPassword")}
                />
                <PasswordInput
                    label="Confirm New Password"
                    mt="sm"
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
            title={<Text size="lg">Users</Text>}
            size={isSmallScreen ? "100%" : "70%"}
            className="max-h-80"
        >
            <ScrollArea className="overflow-x-auto">
                <Table className="min-w-full">
                    <Table.Tr className="bg-gray-100">
                        <Table.Th className="px-4 py-2 w-1/6">
                            Username
                        </Table.Th>
                        <Table.Th className="px-4 py-2 w-1/4">Email</Table.Th>
                        <Table.Th className="px-2 py-1 w-1/6">Phone</Table.Th>
                        <Table.Th className="px-4 py-2 w-1/6">Role</Table.Th>
                        <Table.Th className="px-4 py-2 w-1/6">Status</Table.Th>
                        <Table.Th className="px-4 py-2 w-1/6">Actions</Table.Th>
                    </Table.Tr>
                    <Table.Tbody>
                        {users?.map((user: any, index: any) => (
                            <Table.Tr key={index} className="hover:bg-gray-50">
                                <Table.Td className="px-4 py-2 w-1/6">
                                    {user?.username}
                                </Table.Td>
                                <Table.Td className="px-4 py-2 w-1/4">
                                    {user?.email}
                                </Table.Td>
                                <Table.Td className="px-2 py-1 w-1/6 text-sm">
                                    {user?.phone}
                                </Table.Td>
                                <Table.Td className="px-4 py-2 w-1/6">
                                    {user?.role ?? "-"}
                                </Table.Td>
                                <Table.Td className="px-4 py-2 w-1/6">
                                    {user?.status ? (
                                        <Badge
                                            color="green"
                                            radius="xs"
                                            size="sm"
                                        >
                                            ACTIVE
                                        </Badge>
                                    ) : (
                                        <Badge
                                            color="red"
                                            radius="xs"
                                            size="sm"
                                        >
                                            INACTIVE
                                        </Badge>
                                    )}
                                </Table.Td>
                                <Table.Td className="px-4 py-2 w-1/6">
                                    <Menu>
                                        <Menu.Target>
                                            <IconDotsVertical size={16} />
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Label>Actions</Menu.Label>
                                            <Menu.Item
                                                color={
                                                    user?.status
                                                        ? "red"
                                                        : "green"
                                                }
                                                variant="light"
                                                leftSection={
                                                    user?.status ? (
                                                        <IconMobiledataOff
                                                            size={16}
                                                        />
                                                    ) : (
                                                        <IconMobiledata
                                                            size={16}
                                                        />
                                                    )
                                                }
                                            >
                                                Deactivate
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
            toNotify("Error", "User created failed", "ERROR");
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
            title={<Text size="lg">Add Users</Text>}
        >
            <form onSubmit={addUserForm.onSubmit(handleAddUseForm)}>
                <TextInput
                    label="User Name"
                    placeholder="Enter username"
                    {...addUserForm.getInputProps("username")}
                />
                <TextInput
                    label="Email"
                    mt="sm"
                    placeholder="Enter email"
                    {...addUserForm.getInputProps("email")}
                />
                <TextInput
                    label="Phone"
                    mt="sm"
                    type="number"
                    placeholder="Enter phone"
                    {...addUserForm.getInputProps("phone")}
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
            <Box px="lg" mb="lg" className="gap-1">
                <div className="flex flex-row sm:flex-row items-start sm:items-center mb-2">
                    <Text className="w-1/4">Username:</Text>
                    <Text className="w-2/4">{user?.username}</Text>
                    <Button
                        size="xs"
                        variant="light"
                        className="w-full sm:w-auto"
                        onClick={passwordChangeHandler.open}
                    >
                        Change Password
                    </Button>
                </div>
                <hr />
                <div className="flex flex-row sm:flex-row items-start sm:items-center mb-2">
                    <Text className="w-1/4">Mobile Number:</Text>
                    <Text className="w-3/4">{user?.phone}</Text>
                </div>
                <hr />
                <div className="flex flex-row sm:flex-row items-start sm:items-center mb-2">
                    <Text className="w-1/4">Email:</Text>
                    <Text className="w-3/4">{user?.email}</Text>
                </div>
                <hr />
                <div className="flex flex-row sm:flex-row  items-start sm:items-center mb-2">
                    <Text className="w-1/4">Role:</Text>
                    <Text className="w-3/4">{user?.role || "-"}</Text>
                </div>
                <hr />

                <div className="flex flex-row sm:flex-row  items-start sm:items-center mb-2"></div>
            </Box>
            <Box display="flex" p="lg" className="items-center justify-between">
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
                    <Button
                        size="xs"
                        variant="light"
                        className="w-full sm:w-auto"
                        onClick={handleAddUser.open}
                        leftSection={<IconPlus size={16} />}
                    >
                        Add User
                    </Button>
                </div>
                <hr />
            </Box>
            {passwordChangeModal()}
            {viewUsersModal()}
            {adduserOpenedModal()}
        </>
    );
};

export default Settings;
