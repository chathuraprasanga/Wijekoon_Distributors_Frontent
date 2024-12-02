import React, { createContext, useContext, useState } from "react";
import Loading from "../components/Loading.tsx";

interface LoadingContextType {
    setLoading: (state: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const setLoading = (state: boolean) => {
        setIsLoading(state);
    };

    return (
        <LoadingContext.Provider value={{ setLoading }}>
    {children}
    {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Loading/>
        </div>
    )}
    </LoadingContext.Provider>
);
};

export const useLoading = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
};
