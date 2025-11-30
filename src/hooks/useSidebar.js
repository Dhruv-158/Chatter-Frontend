import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectIsSidebarOpen,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    setSidebarOpen,
} from '@/states/sidebarSlice';

/**
 * Custom hook for sidebar state management
 * Provides easy access to sidebar state and actions
 */
export const useSidebar = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector(selectIsSidebarOpen);

    const toggle = useCallback(() => {
        dispatch(toggleSidebar());
    }, [dispatch]);

    const open = useCallback(() => {
        dispatch(openSidebar());
    }, [dispatch]);

    const close = useCallback(() => {
        dispatch(closeSidebar());
    }, [dispatch]);

    const setOpen = useCallback((value) => {
        const openState = typeof value === "function" ? value(isOpen) : value;
        dispatch(setSidebarOpen(openState));
    }, [dispatch, isOpen]);

    return {
        isOpen,
        toggle,
        open,
        close,
        setOpen,
    };
};