import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../states/authSlice";
import loadingReducer from "../states/loadingSlice";
import userReducer from "../states/userSlice";
import sidebarSlice from "../states/sidebarSlice";
import friendSlice from "../states/friendSlice";
import messageSlice from "../states/messageSlice";
import notificationSlice from "../states/notificationSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        loading: loadingReducer,
        user: userReducer,
        sidebar: sidebarSlice,
        friends: friendSlice,
        messages: messageSlice,
        notifications: notificationSlice
    },
    devTools: true,
});

// Expose store globally for access in reducers
if (typeof window !== 'undefined') {
    window.__REDUX_STORE__ = store;
}

export default store;