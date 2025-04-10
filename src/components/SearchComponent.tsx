import { Box, Button, Grid, TextInput } from "@mantine/core";

const SearchComponent = ({ data }: any) => {
    console.log("data", data.type);
    return (
        <>
            <Box>
                <Grid>
                    <Grid.Col span={2}>
                        <TextInput size="xs" placeholder="Input 1" />
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <TextInput size="xs" placeholder="Input 2" />
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <TextInput size="xs" placeholder="Input 3" />
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <TextInput size="xs" placeholder="Input 4" />
                    </Grid.Col>
                </Grid>
                <Grid>
                    <Grid.Col span={2}>
                        <TextInput size="xs" placeholder="Input 5" />
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <TextInput size="xs" placeholder="Input 6" />
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <TextInput size="xs" placeholder="Input 7" />
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <TextInput size="xs" placeholder="Input 8" />
                    </Grid.Col>
                </Grid>
                <Grid>
                    <Grid.Col span={2}>
                        <Button fullWidth size="xs">
                            Search
                        </Button>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Button fullWidth size="xs">
                            Clear
                        </Button>
                    </Grid.Col>
                </Grid>
            </Box>
        </>
    );
};

export default SearchComponent;
