import { notifications } from "@mantine/notifications";
import { IconAlertCircle } from "@tabler/icons-react";

const toNotify = (
    title: string,
    message: string,
    type: "SUCCESS" | "ERROR" | "LOADING" | "WARNING"
) => {
    const colors: Record<string, string> = {
        SUCCESS: "green",
        ERROR: "red",
        LOADING: "blue",
        WARNING: "yellow",
    };

    return notifications.show({
        title: title,
        message: message,
        color: colors[type], // Correctly map type to color
        loading: type === "LOADING", // Boolean expression for loading
        icon:
            type === "WARNING" ? (
                <IconAlertCircle size={20} />
            ) : undefined,
    });
};

export default toNotify;