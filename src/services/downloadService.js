import axios from 'axios';
import proxyService from './proxyService';

/**
 * Downloads a file from the server
 * @param {string} url - The URL of the file to download
 * @param {string} fileName - The name to save the file as
 */
export const downloadFile = async (url, fileName) => {
    try {
        console.log("Downloading file:", fileName, "from URL:", url);

        // Use the proxy service to fetch the file
        const blob = await proxyService.fetchFile(url);

        // Create a blob URL
        const blobUrl = window.URL.createObjectURL(blob);

        // Create an anchor element and trigger the download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName || 'download';
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

        return true;
    } catch (error) {
        console.error('Error downloading file:', error);
        return false;
    }
};

/**
 * Opens a file in a new browser tab
 * @param {string} url - The URL of the file to open
 */
export const openFileInBrowser = async (url) => {
    try {
        // For certain file types, we want to fetch the file and display it in a new tab
        // This helps with CORS issues and provides better error handling
        const fileName = url.split('/').pop();
        const fileExtension = fileName.split('.').pop().toLowerCase();

        // List of extensions that we want to handle with our proxy
        const handledExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'gif'];

        if (handledExtensions.includes(fileExtension)) {
            // Use the proxy service to fetch the file
            const blob = await proxyService.fetchFile(url);

            // Get the content type
            const contentType = proxyService.getContentType(fileName);

            // Create a blob URL with the correct content type
            const blobUrl = window.URL.createObjectURL(
                new Blob([blob], { type: contentType })
            );

            // Open the blob URL in a new tab
            window.open(blobUrl, '_blank');
        } else {
            // For other file types, just open the URL directly
            // Ensure the URL is properly formatted
            let fileUrl = url;

            // If the URL doesn't start with http/https, assume it's a relative path
            if (url && !url.startsWith('http')) {
                fileUrl = `${window.API_CONFIG.BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
            }

            console.log("Opening file in browser:", fileUrl);

            // Open the file in a new tab
            window.open(fileUrl, '_blank');
        }

        return true;
    } catch (error) {
        console.error('Error opening file in browser:', error);
        return false;
    }
}; 