import { Avatar, Group, Menu, rem } from "@mantine/core";
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
                            name={avatar}
                            key={avatar}
                            radius="xl"
                        ></Avatar>
                        <div className="flex flex-col">
                            <div className="hidden md:flex lg:flex flex-col">
                                <span className="font-bold text-sm text-gray-800">
                                    {userDetails.username}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {userDetails.email}
                                </span>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <IconChevronRight size={20} color="gray" />
                        </div>
                    </Group>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Label hiddenFrom="lg">User Details</Menu.Label>
                    <Menu.Item hiddenFrom="lg">
                        <span>{userDetails.username}</span>
                        <br />
                        <span className="text-xs">{userDetails.email}</span>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Label>Application</Menu.Label>
                    <Menu.Item
                        leftSection={
                            <IconSettings
                                style={{ width: rem(14), height: rem(14) }}
                            />
                        }
                        disabled
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
