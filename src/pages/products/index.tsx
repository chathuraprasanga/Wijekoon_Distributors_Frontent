import {
    Badge,
    Box,
    Button,
    Card,
    Flex,
    Group,
    Menu,
    Pagination,
    Table,
    Text,
} from "@mantine/core";
import {
    IconDatabaseOff,
    IconDotsVertical,
    IconEdit,
    IconEye,
    IconMobiledata,
    IconMobiledataOff,
} from "@tabler/icons-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import {
    changeStatusProduct,
    getPagedProducts,
} from "../../store/productSlice/productSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";
import { amountPreview, pageRange } from "../../helpers/preview.tsx";
import { BASIC_STATUS_COLORS, USER_ROLES } from "../../helpers/types.ts";
import { hasAnyPrivilege } from "../../helpers/previlleges.ts";
import { DynamicSearchBar } from "../../components/DynamicSearchBar.tsx";

const Products = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();

    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 5;
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [status, setStatus] = useState<string>();
    const sort = -1;
    const filters = { pageSize, pageIndex, searchQuery, sort, status };

    const [metadata, setMetadata] = useState<any>();

    const products = useSelector((state: RootState) => state.product.products);
    const user = useSelector((state: RootState) => state.auth.user);
    const role = user.role;

    useEffect(() => {
        fetchProducts();
    }, [dispatch, pageIndex, searchQuery, status]);

    const fetchProducts = async () => {
        setLoading(true);
        const response = await dispatch(getPagedProducts({ filters: filters }));
        setMetadata(response.payload.result.metadata);
        setLoading(false);
    };

    const handleChangeStatus = async (product: any) => {
        setLoading(true);
        const response = await dispatch(
            changeStatusProduct({
                id: product._id,
                values: { status: !product.status },
            })
        );
        if (response.type === "product/changeStatus/fulfilled") {
            dispatch(getPagedProducts({ filters: filters }));
            setLoading(false);
            toNotify(
                "Success",
                "Product status changed successfully",
                "SUCCESS"
            );
        } else if (response.type === "product/changeStatus/rejected") {
            setLoading(false);
            toNotify("Error", `${response.payload.error}`, "ERROR");
        } else {
            setLoading(false);
            toNotify(
                "Something went wrong",
                `Please contact system admin`,
                "WARNING"
            );
        }
    };

    return (
        <>
            {/* Header */}
            <Box display="flex" p="lg" className="items-center justify-between">
                <Box>
                    <Text size="lg" fw={500}>
                        Products
                    </Text>
                </Box>
                <Flex gap="sm" wrap="wrap">
                    {hasAnyPrivilege(role, [
                        USER_ROLES.ADMIN,
                        USER_ROLES.SUPER_ADMIN,
                        USER_ROLES.OWNER,
                    ]) && (
                        <Button
                            size="xs"
                            onClick={() =>
                                navigate("/app/products/add-product")
                            }
                        >
                            Add Products
                        </Button>
                    )}
                </Flex>
            </Box>

            {/* Search Input */}
            <DynamicSearchBar
                fields={[
                    {
                        type: "text",
                        placeholder: "Name, ProductCode",
                        value: searchQuery,
                        onChange: (value) => {
                            setSearchQuery(value);
                            setPageIndex(1);
                        },
                    },
                    {
                        type: "select",
                        placeholder: "Select a status",
                        value: status,
                        options: ["ACTIVE", "INACTIVE"],
                        clearable: true,
                        onChange: (value: string | null) => {
                            if (value) {
                                setStatus(value);
                            } else {
                                setStatus("");
                            }
                            setPageIndex(1);
                        },
                    },
                ]}
            />

            {/* Desktop Table */}
            <Box visibleFrom="lg" mx="lg" my="lg" className="overflow-x-auto">
                <Table
                    striped
                    highlightOnHover
                    withTableBorder
                    withColumnBorders
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th style={{ width: "30%" }}>Name</Table.Th>
                            <Table.Th style={{ width: "25%" }}>
                                Product Code
                            </Table.Th>
                            <Table.Th style={{ width: "15%" }}>Size</Table.Th>
                            <Table.Th style={{ width: "15%" }}>
                                Unit Price
                            </Table.Th>
                            <Table.Th style={{ width: "10%" }}>Status</Table.Th>
                            <Table.Th style={{ width: "5%" }}></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {products?.length !== 0 ? (
                            products?.map((c: any, i: number) => (
                                <Table.Tr key={i}>
                                    <Table.Td style={{ width: "30%" }}>
                                        {c.name}
                                    </Table.Td>
                                    <Table.Td style={{ width: "25%" }}>
                                        {c.productCode}
                                    </Table.Td>
                                    <Table.Td style={{ width: "15%" }}>
                                        {c.size} KG
                                    </Table.Td>
                                    <Table.Td style={{ width: "15%" }}>
                                        {amountPreview(c.unitPrice)}
                                    </Table.Td>
                                    <Table.Td style={{ width: "10%" }}>
                                        <Badge
                                            color={
                                                BASIC_STATUS_COLORS[
                                                    c.status as keyof typeof BASIC_STATUS_COLORS
                                                ] || "gray"
                                            }
                                            size="sm"
                                            radius="xs"
                                        >
                                            {c.status ? "ACTIVE" : "INACTIVE"}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td style={{ width: "5%" }}>
                                        <Menu width={150}>
                                            <Menu.Target>
                                                <IconDotsVertical
                                                    size="16"
                                                    className="cursor-pointer"
                                                />
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                <Menu.Label>Actions</Menu.Label>
                                                <Menu.Item
                                                    onClick={() => {
                                                        navigate(
                                                            `/app/products/view-product/${c._id}`
                                                        );
                                                        sessionStorage.setItem(
                                                            "pageIndex",
                                                            String(pageIndex)
                                                        );
                                                    }}
                                                    rightSection={
                                                        <IconEye size={16} />
                                                    }
                                                >
                                                    View
                                                </Menu.Item>
                                                <Menu.Item
                                                    onClick={() => {
                                                        navigate(
                                                            `/app/products/edit-product/${c._id}`
                                                        );
                                                        sessionStorage.setItem(
                                                            "pageIndex",
                                                            String(pageIndex)
                                                        );
                                                    }}
                                                    rightSection={
                                                        <IconEdit size={16} />
                                                    }
                                                    disabled={
                                                        !hasAnyPrivilege(role, [
                                                            USER_ROLES.OWNER,
                                                            USER_ROLES.SUPER_ADMIN,
                                                            USER_ROLES.ADMIN,
                                                        ])
                                                    }
                                                >
                                                    Edit
                                                </Menu.Item>
                                                <Menu.Item
                                                    color={
                                                        BASIC_STATUS_COLORS[
                                                            c.status
                                                                ? "false"
                                                                : ("true" as keyof typeof BASIC_STATUS_COLORS)
                                                        ] || "gray"
                                                    }
                                                    onClick={() =>
                                                        handleChangeStatus(c)
                                                    }
                                                    rightSection={
                                                        c.status ? (
                                                            <IconMobiledataOff
                                                                size={16}
                                                            />
                                                        ) : (
                                                            <IconMobiledata
                                                                size={16}
                                                            />
                                                        )
                                                    }
                                                    disabled={
                                                        !hasAnyPrivilege(role, [
                                                            USER_ROLES.OWNER,
                                                            USER_ROLES.SUPER_ADMIN,
                                                            USER_ROLES.ADMIN,
                                                        ])
                                                    }
                                                >
                                                    {c.status ? (
                                                        <span className="text-red-700">
                                                            Deactivate
                                                        </span>
                                                    ) : (
                                                        <span className="text-green-700">
                                                            Activate
                                                        </span>
                                                    )}
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </Table.Td>
                                </Table.Tr>
                            ))
                        ) : (
                            <Table.Tr>
                                <Table.Td colSpan={6} className="text-center">
                                    <div className="flex justify-center items-center">
                                        <IconDatabaseOff
                                            color="red"
                                            size="24"
                                            className="mr-2 self-center"
                                        />
                                        No data available
                                    </div>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </Box>

            {/* Mobile Cards */}
            <Box my="lg" mx="sm" hiddenFrom="lg">
                {products?.length !== 0 ? (
                    products?.map((c: any, i: number) => (
                        <Card key={i} shadow="sm" withBorder mx="xs" my="lg">
                            <Text className="font-semibold">
                                Name: {c.name}
                            </Text>
                            <Text>Product Code: {c.productCode}</Text>
                            <Text>Size: {c.size} KG</Text>
                            <Text>
                                Unit Price: {amountPreview(c.unitPrice)}
                            </Text>
                            <Badge
                                color={
                                    BASIC_STATUS_COLORS[
                                        c.status as keyof typeof BASIC_STATUS_COLORS
                                    ] || "gray"
                                }
                                size="sm"
                                radius="xs"
                                className="mt-2"
                            >
                                {c.status ? "ACTIVE" : "INACTIVE"}
                            </Badge>
                            <Group mt="md">
                                <Menu width={150}>
                                    <Menu.Target>
                                        <IconDotsVertical
                                            size="16"
                                            className="cursor-pointer"
                                        />
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Label>Actions</Menu.Label>
                                        <Menu.Item
                                            onClick={() => {
                                                navigate(
                                                    `/app/products/view-product/${c._id}`
                                                );
                                                sessionStorage.setItem(
                                                    "pageIndex",
                                                    String(pageIndex)
                                                );
                                            }}
                                            rightSection={<IconEye size={16} />}
                                        >
                                            View
                                        </Menu.Item>
                                        <Menu.Item
                                            onClick={() => {
                                                navigate(
                                                    `/app/products/edit-product/${c._id}`
                                                );
                                                sessionStorage.setItem(
                                                    "pageIndex",
                                                    String(pageIndex)
                                                );
                                            }}
                                            rightSection={
                                                <IconEdit size={16} />
                                            }
                                            disabled={
                                                !hasAnyPrivilege(role, [
                                                    USER_ROLES.OWNER,
                                                    USER_ROLES.SUPER_ADMIN,
                                                    USER_ROLES.ADMIN,
                                                ])
                                            }
                                        >
                                            Edit
                                        </Menu.Item>
                                        <Menu.Item
                                            color={
                                                BASIC_STATUS_COLORS[
                                                    c.status
                                                        ? "false"
                                                        : ("true" as keyof typeof BASIC_STATUS_COLORS)
                                                ] || "gray"
                                            }
                                            onClick={() =>
                                                handleChangeStatus(c)
                                            }
                                            rightSection={
                                                c.status ? (
                                                    <IconMobiledataOff
                                                        size={16}
                                                    />
                                                ) : (
                                                    <IconMobiledata size={16} />
                                                )
                                            }
                                            disabled={
                                                !hasAnyPrivilege(role, [
                                                    USER_ROLES.OWNER,
                                                    USER_ROLES.SUPER_ADMIN,
                                                    USER_ROLES.ADMIN,
                                                ])
                                            }
                                        >
                                            {c.status ? (
                                                <span className="text-red-700">
                                                    Deactivate
                                                </span>
                                            ) : (
                                                <span className="text-green-700">
                                                    Activate
                                                </span>
                                            )}
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </Group>
                        </Card>
                    ))
                ) : (
                    <Group mx="xs" my="lg">
                        <IconDatabaseOff color="red" size={24} />
                        <Text>No data available</Text>
                    </Group>
                )}
            </Box>

            {/* Pagination */}
            <Group my="md" ms="md" px="lg" justify="space-between">
                <Group>
                    {pageRange(metadata?.pageIndex, pageSize, metadata?.total)}
                </Group>
                <Pagination.Root
                    total={Math.ceil(metadata?.total / pageSize)}
                    value={pageIndex}
                    onChange={setPageIndex}
                    size="sm"
                    siblings={1}
                    boundaries={0}
                >
                    <Group gap={5} justify="center">
                        <Pagination.First />
                        <Pagination.Previous />
                        <Pagination.Items />
                        <Pagination.Next />
                        <Pagination.Last />
                    </Group>
                </Pagination.Root>
            </Group>
        </>
    );
};

export default Products;
