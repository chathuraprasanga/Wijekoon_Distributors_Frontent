import { Loader } from "@mantine/core";

const Loading = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Loader color="black" size="md" type="bars" />
        </div>
    );
};

export default Loading;
