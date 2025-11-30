import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
    selectUserProfilePicture,
    selectFullProfilePictureUrl,
    selectIsUploadLoading,
    selectUploadError,
} from '@/states/userSlice';
import { changeProfilePictureWithProgress } from '@/services/userService';

export const useProfilePicture = () => {
    const [preview, setPreview] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const profilePicture = useSelector(selectUserProfilePicture);
    const fullUrl = useSelector(selectFullProfilePictureUrl);
    const isUploading = useSelector(selectIsUploadLoading);
    const uploadError = useSelector(selectUploadError);
    // Validate file before upload
    const validateFile = useCallback((file) => {
        setValidationError(null);
        if (!file) {
            setValidationError('No file selected');
            return false;
        }
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setValidationError('Only JPEG, PNG, GIF, and WebP images are allowed');
            return false;
        }
        // Check file size (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setValidationError('File size must be less than 5MB');
            return false;
        }
        return true;
    }, []);
    // Create preview from file
    const createPreview = useCallback((file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    }, []);

    // Upload profile picture
    const uploadPicture = useCallback(async (file) => {
        if (!validateFile(file)) {
            return { success: false, error: validationError };
        }
        const result = await changeProfilePictureWithProgress(file);
        if (result.success) {
            setPreview(null); // Clear preview after successful upload
        }
        return result;
    }, [validateFile, validationError]);
    // Clear preview
    const clearPreview = useCallback(() => {
        setPreview(null);
        setValidationError(null);
    }, []);

    return {
        profilePicture,
        fullUrl,
        preview,
        isUploading,
        uploadError,
        validationError,
        validateFile,
        createPreview,
        uploadPicture,
        clearPreview,
    };
};