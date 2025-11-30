import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isSidebarOpen: false,
};

const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        toggleSidebar(state) {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        openSidebar(state) {
            state.isSidebarOpen = true;
        },
        closeSidebar(state) {
            state.isSidebarOpen = false;
        },
        // Optional: Add if you want to set state explicitly
        setSidebarOpen(state, action) {
            state.isSidebarOpen = action.payload;
        },
    },
});

export const { 
    toggleSidebar, 
    openSidebar, 
    closeSidebar,
    setSidebarOpen 
} = sidebarSlice.actions;

export default sidebarSlice.reducer;

// Selectors
export const selectIsSidebarOpen = (state) => state.sidebar.isSidebarOpen;
export const selectSidebarState = (state) => state.sidebar;