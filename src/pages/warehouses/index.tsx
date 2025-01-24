import { Alert, Box, Text } from "@mantine/core";

const Warehouses = () => {
    return (
        <>
            {/* Header */}
            <Box display="flex" p="lg" className="items-center justify-between">
                <Box>
                    <Text size="lg" fw={500}>
                        Warehouses
                    </Text>
                </Box>
                <Box></Box>
            </Box>

            <Box p="md">
                <Alert title="Notice" color="yellow">
                    <Text c="yellow">This page is under Development</Text>
                </Alert>
            </Box>
        </>
    );
};

export default Warehouses;
