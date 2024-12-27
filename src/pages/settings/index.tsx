import {
    Box,
    Button,
    Modal,
    PasswordInput,
    Text,
    TextInput,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { changePassword } from "../../store/authSlice/authSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";

const Settings = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [passwordChangeModalOpened, passwordChangeHandler] =
        useDisclosure(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch | any>();

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

    const handlePasswordChange = async (values: typeof pwForm.values) => {
        setIsLoading(true);
        const response = await dispatch(changePassword(values));
        if (response.type === "auth/changePassword/fulfilled") {
            toNotify("Success", "Password changed successfully", "SUCCESS");
            setIsLoading(false);
            passwordChangeHandler.close();
            pwForm.reset();
        } else if (response.type === "auth/changePassword/rejected") {
            toNotify("Error", `${response.payload.error || "Something went wrong"}`, "ERROR");
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
            title="Change Password"
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
                    <Text className="w-3/4">{user?.username}</Text>
                </div>

                <div className="flex flex-row sm:flex-row items-start sm:items-center mb-2">
                    <Text className="w-1/4">Mobile Number:</Text>
                    <Text className="w-3/4">{user?.phone}</Text>
                </div>

                <div className="flex flex-row sm:flex-row items-start sm:items-center mb-2">
                    <Text className="w-1/4">Email:</Text>
                    <Text className="w-3/4">{user?.email}</Text>
                </div>

                <div className="flex flex-row sm:flex-row  items-start sm:items-center mb-2">
                    <Text className="w-1/4">Role:</Text>
                    <Text className="w-3/4">{user?.role || "-"}</Text>
                </div>

                <Button
                    size="xs"
                    className="w-full sm:w-auto"
                    onClick={passwordChangeHandler.open}
                >
                    Change Password
                </Button>
            </Box>
            {passwordChangeModal()}
        </>
    );
};

export default Settings;
