import logo from "../assets/logo1.png";
import { Box, Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useNavigate } from "react-router";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store.ts";
import { login } from "../store/authSlice/authSlice.ts";
import toNotify from "../helpers/toNotify.tsx";
import { useLoading } from "../helpers/loadingContext.tsx";

const LoginPage = () => {
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch | any>();

    const loginForm = useForm({
        mode: "controlled",
        initialValues: {
            emailOrPhone: "",
            password: "",
        },
        validate: {
            emailOrPhone: (value) => {
                if (!value) {
                    return "Email or phone is required";
                }
                // Regex for validating email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                // Regex for validating phone number
                const phoneRegex = /^[0-9]{10}$/;

                if (!emailRegex.test(value) && !phoneRegex.test(value)) {
                    return "Enter a valid email or phone number";
                }

                return null; // No error
            },
            password: (value) => (value ? null : "Password is required"),
        },
    });

    const handleLogin = async (values: typeof loginForm.values, event: any) => {
        event.preventDefault();
        setLoading(true);
        try {
            const payload = await dispatch(login(values));
            switch (payload.type) {
                case "auth/login/rejected": {
                    const error = payload.payload.error;
                    setLoading(false)
                    toNotify("Login Error", `${error}`, "ERROR");
                    break;
                }
                case "auth/login/fulfilled":
                    console.log("Login successful");
                    setLoading(false)
                    navigate("/");
                    break;
                default:
                    setLoading(false)
                    break;
            }
        } catch (e:any) {
            setLoading(false)
            console.error("Unexpected error:", e.message);
            toNotify("Login Error", "An unexpected error occurred", "ERROR");
        }
    };

    return (
        <div className="w-screen h-screen flex flex-row">
            <div className="lg:w-1/2 bg-black text-white p-4 flex-col hidden sm:flex">
                <div>
                    <img src={logo} alt="logo" className="h-16" />
                </div>
                <div className="h-screen place-content-end">
                    <span className="text-lg">Wijekoon Distributors ⌘ </span>
                    <br />
                    <span className="text-sm">
                        Wijekoon Distributors is a company located in
                        Mawathagama, Kurunegala, Sri Lanka, specializing in
                        business operations across the North Western Province.
                        The company focuses on the distribution of mineral and
                        chemical products, in collaboration with Keshara
                        Minerals and Chemicals (Pvt) Limited. Their expertise in
                        combining these products ensures efficient and reliable
                        supply chain operations within the region.
                    </span>
                </div>
            </div>
            <div className="w-full md:w-1/2 h-full bg-white flex flex-col justify-center items-center p-4">
                {/* Logo on Mobile */}
                <div className="flex md:hidden justify-center mb-4">
                    <img src={logo} alt="logo" className="h-32" />
                </div>
                <Box maw={400} w="100%">
                    <form onSubmit={loginForm.onSubmit(handleLogin)}>
                        <TextInput
                            withAsterisk
                            label="Email or Phone"
                            placeholder="your@email.com / 0XXXXXXXXX"
                            {...loginForm.getInputProps("emailOrPhone")}
                        />

                        <PasswordInput
                            withAsterisk
                            label="Password"
                            type="password"
                            placeholder="Password"
                            mt="md"
                            {...loginForm.getInputProps("password")}
                        />

                        <Group
                            mt="md"
                            className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 md:space-x-4"
                        >
                            <Button type="submit" color="black" fullWidth>
                                Login
                            </Button>
                        </Group>
                    </form>
                </Box>
            </div>
        </div>
    );
};

export default LoginPage;
