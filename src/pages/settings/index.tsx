import { Box, Button, Text } from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";

const Settings = () => {
    const user = useSelector((state:RootState) => state.auth.user);

    const openPasswordChanger = () => {

    }
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
                    <Text className="w-3/4">{user.username}</Text>
                </div>

                <div className="flex flex-row sm:flex-row items-start sm:items-center mb-2">
                    <Text className="w-1/4">Mobile Number:</Text>
                    <Text className="w-3/4">{user.phone}</Text>
                </div>

                <div className="flex flex-row sm:flex-row items-start sm:items-center mb-2">
                    <Text className="w-1/4">Email:</Text>
                    <Text className="w-3/4">{user.email}</Text>
                </div>

                <div className="flex flex-row sm:flex-row  items-start sm:items-center mb-2">
                    <Text className="w-1/4">Role:</Text>
                    <Text className="w-3/4">{user.role || "-"}</Text>
                </div>

                <Button size="xs" className="w-full sm:w-auto" onClick={() => openPasswordChanger}>Change Password</Button>
            </Box>
        </>
    );
};

export default Settings;