import { redirect } from "react-router-dom";
import { AppDispatch, store } from "../store/store";
import { confirmUserLogin } from "../store/authSlice/authSlice";

export const AuthLoaderChecker = async () => {
    const payload: any = await store.dispatch<AppDispatch | any>(
        confirmUserLogin(),
    );
    if (payload.type !== "auth/user/fulfilled") {
        return redirect("/login");
    }
    return null;
};
