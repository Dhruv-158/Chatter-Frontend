import { useState, useCallback, useEffect, useRef } from 'react';
import { updateUserProfileService } from '@/services/userService';

/**
 * Hook for updating general profile information
 * Handles form state and submission
 */
export const useProfileUpdate = (initialData = {}) => {
    const [formData, setFormData] = useState(initialData);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    
    // Track previous initialData to prevent infinite loops
    const prevInitialDataRef = useRef();

    // Update formData when initialData changes (when profile loads)
    useEffect(() => {
        // Only update if the bio value actually changed
        const bioChanged = initialData.bio !== prevInitialDataRef.current?.bio;
        
        if (bioChanged) {
            setFormData(initialData);
            prevInitialDataRef.current = initialData;
        }
    }, [initialData.bio]); // Only depend on the bio value, not the entire object
    const updateField = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setUpdateError(null);
        setUpdateSuccess(false);
    }, []);
    const updateProfile = useCallback(async (customData) => {
        setIsUpdating(true);
        setUpdateError(null);
        setUpdateSuccess(false);
        try {
            const dataToUpdate = customData || formData;
            const result = await updateUserProfileService(dataToUpdate);
            
            if (result.success) {
                setUpdateSuccess(true);
                return { success: true, data: result.data };
            }
        } catch (error) {
            setUpdateError(error.message);
            return { success: false, error: error.message };
        } finally {
            setIsUpdating(false);
        }
    }, [formData]);

    const resetForm = useCallback(() => {
        setFormData(initialData);
        setUpdateError(null);
        setUpdateSuccess(false);
    }, [initialData]);
    
    return {
        formData,
        setFormData,
        updateField,
        updateProfile,
        resetForm,
        isUpdating,
        updateError,
        updateSuccess,
    };
};