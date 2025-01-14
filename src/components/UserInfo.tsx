import { Avatar, Box, Group, Menu, rem, Text, useMantineColorScheme } from "@mantine/core";
import {
    IconChevronRight,
    IconLogout,
    IconSettings,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store.ts";
import { logOut } from "../store/authSlice/authSlice.ts";

const UserInfo = () => {
    const { setColorScheme } = useMantineColorScheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userDetails = useSelector((state: RootState) => state.auth.user);

    const avatar = userDetails?.username
        ?.split(" ")
        .map((name: any) => name[0])
        .join("")
        .toUpperCase();

    return (
        <>
            <Menu shadow="md" width="200">
                <Menu.Target>
                    <Group className="cursor-pointer">
                        {/* Avatar */}
                        <Avatar
                            color="initials"
                            variant="gradient"
                            name={avatar}
                            key={avatar}
                            radius="xl"
                        ></Avatar>
                        <Group visibleFrom={"lg"}>
                            <Box>
                                <Box>
                                    <Text fw={700} size="sm">
                                        {userDetails?.username}
                                    </Text>
                                    <Text size="xs" c="gray.5">
                                        {userDetails?.email}
                                    </Text>
                                </Box>
                            </Box>

                            {/* Chevron Icon Section */}
                            <Box>
                                <IconChevronRight size={20} color="gray" />
                            </Box>
                        </Group>
                    </Group>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Label hiddenFrom="lg">User Details</Menu.Label>
                    <Menu.Item hiddenFrom="lg">
                        <Text>{userDetails?.username}</Text>
                        <Text size="xs" c="gray.6">
                            {userDetails?.email}
                        </Text>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Label>Application</Menu.Label>
                    <Menu.Item
                        leftSection={
                            <IconSettings
                                style={{ width: rem(14), height: rem(14) }}
                            />
                        }
                        onClick={() => navigate("/app/settings")}
                    >
                        Settings
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Label>Danger zone</Menu.Label>
                    <Menu.Item
                        color="red"
                        leftSection={
                            <IconLogout
                                style={{ width: rem(14), height: rem(14) }}
                            />
                        }
                        onClick={() => {
                            dispatch(logOut());
                            navigate("/login");
                            setColorScheme("light")
                        }}
                    >
                        Logout
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </>
    );
};

export default UserInfo;
