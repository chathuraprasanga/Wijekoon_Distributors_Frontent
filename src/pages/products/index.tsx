import { Badge, Button, Group, Menu, Pagination, Table } from "@mantine/core";
import { IconDatabaseOff, IconDotsVertical } from "@tabler/icons-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
// import products from "../products/product_data.json";
import { useLoading } from "../../helpers/loadingContext.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { changeStatusProduct, getProducts } from "../../store/productSlice/productSlice.ts";
import toNotify from "../../helpers/toNotify.tsx";

const Products = () => {
    const { setLoading } = useLoading();
    const dispatch = useDispatch<AppDispatch | any>();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const products = useSelector((state: RootState) => state.product.products);

    useEffect(() => {
        fetchProducts();
        setPage();
    }, []);

    const setPage = () => {
        setCurrentPage(Number(sessionStorage.getItem("pageIndex") || 1));
        console.log(Number(sessionStorage.getItem("pageIndex")));
        sessionStorage.clear();
    };

    const fetchProducts = async () => {
        setLoading(true);
        await dispatch(getProducts({}));
        setLoading(false);
    };

    const totalPages = Math.ceil(products?.length / pageSize);
    const paginatedData: any = products?.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleChangeStatus = async (product: any) => {
        setLoading(true);
        const response = await dispatch(
            changeStatusProduct({
                id: product._id,
                values: { status: !product.status },
            })
        );
        if (response.type === "product/changeStatus/fulfilled") {
            dispatch(getProducts({}));
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
            <div className="items-center flex flex-row justify-between p-4">
                <div>
                    <span className="text-lg font-semibold">Products</span>
                </div>
                <div>
                    <Button
                        size="xs"
                        color="dark"
                        onClick={() => navigate("/app/products/add-product")}
                    >
                        Add Products
                    </Button>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block mx-4 my-4 overflow-x-auto">
                <Table
                    striped
                    highlightOnHover
                    withTableBorder
                    withColumnBorders
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Product Code</Table.Th>
                            <Table.Th>Size</Table.Th>
                            <Table.Th>Unit Price</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {paginatedData?.length !== 0 ? (
                            paginatedData?.map((c: any, i: number) => (
                                <Table.Tr key={i}>
                                    <Table.Td>{c.name}</Table.Td>
                                    <Table.Td>{c.productCode}</Table.Td>
                                    <Table.Td>{c.size}</Table.Td>
                                    <Table.Td>
                                        RS. {c.unitPrice.toFixed(2)}
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge
                                            color={c.status ? "green" : "red"}
                                            size="sm"
                                            radius="xs"
                                        >
                                            {c.status ? "ACTIVE" : "INACTIVE"}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
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
                                                            String(currentPage)
                                                        );
                                                    }}
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
                                                            String(currentPage)
                                                        );
                                                    }}
                                                >
                                                    Edit
                                                </Menu.Item>
                                                <Menu.Item
                                                    color={c.status ? "red" : "green"}
                                                    onClick={() =>
                                                        handleChangeStatus(c)
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
            </div>

            {/* Mobile Cards */}
            <div className="block lg:hidden mx-4 my-4">
                {paginatedData?.length !== 0 ? (
                    paginatedData?.map((c: any, i: number) => (
                        <div
                            key={i}
                            className="border border-gray-300 rounded-md mb-4 p-4 bg-white shadow-sm"
                        >
                            <p className="font-semibold">Name: {c.name}</p>
                            <p>Product Code: {c.productCode}</p>
                            <p>Size: {c.size}</p>
                            <p>Unit Price: {c.unitPrice}</p>
                            <Badge
                                color={c.status ? "green" : "red"}
                                size="sm"
                                radius="xs"
                                className="mt-2"
                            >
                                {c.status ? "ACTIVE" : "INACTIVE"}
                            </Badge>
                            <div className="mt-2">
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
                                                    String(currentPage)
                                                );
                                            }}
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
                                                    String(currentPage)
                                                );
                                            }}
                                        >
                                            Edit
                                        </Menu.Item>
                                        <Menu.Item
                                            color={c.status ? "red" : "green"}
                                            onClick={() =>
                                                handleChangeStatus(c)
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
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center">
                        <IconDatabaseOff
                            color="red"
                            size="24"
                            className="mr-2 self-center"
                        />
                        <p>No data available</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="my-4 mx-4 flex justify-end">
                <Pagination.Root
                    total={totalPages}
                    value={currentPage}
                    onChange={setCurrentPage}
                    size="sm"
                    color="dark"
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
            </div>
        </>
    );
};

export default Products;
