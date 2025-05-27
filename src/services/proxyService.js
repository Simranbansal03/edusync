import axios from 'axios';

/**
 * Proxy service to handle file downloads
 * This service acts as a middleware between the frontend and backend
 * It fetches the file from the backend and returns it to the frontend
 * This helps avoid CORS issues and provides better error handling
 */
class ProxyService {
    /**
     * Fetches a file from the server and returns it as a blob
     * @param {string} url - The URL of the file to fetch
     * @returns {Promise<Blob>} - A promise that resolves to a blob
     */
    async fetchFile(url) {
        try {
            // Try direct access to the uploads URL first
            if (url.includes('/uploads/')) {
                console.log("Trying direct access to uploads URL:", url);
                try {
                    // Make a direct GET request to the uploads URL
                    const response = await axios.get(url, {
                        responseType: 'blob'
                    });
                    return response.data;
                } catch (directError) {
                    console.warn("Direct access failed, falling back to API endpoint:", directError);
                    // Fall back to the download endpoint if direct access fails
                }
            }

            // Extract the file ID from the URL
            const fileId = this.extractFileIdFromUrl(url);

            // Create a direct download URL using the API endpoint
            const downloadUrl = `${window.API_CONFIG.BASE_URL}/api/CourseModels/download/${fileId}`;

            console.log("Using direct download URL:", downloadUrl);

            // Make a GET request to the file URL with responseType blob
            const response = await axios.get(downloadUrl, {
                responseType: 'blob'
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching file:', error);
            throw error;
        }
    }

    /**
     * Extracts the file ID from a URL
     * @param {string} url - The URL containing the file ID
     * @returns {string} - The file ID
     */
    extractFileIdFromUrl(url) {
        // Try to extract the file ID from the URL
        // Example URL: https://localhost:7278/uploads/8626a585-783a-48a7-8d00-cb0194871418.pdf
        try {
            // Get the filename from the URL
            const filename = url.split('/').pop();

            // For a GUID-formatted file, just return the filename without extension
            if (filename.match(/[a-f0-9-]{36}\.[a-z0-9]+$/i)) {
                return filename.split('.')[0];
            }

            // Otherwise, return the full filename as the ID
            return filename;
        } catch (error) {
            console.error('Error extracting file ID from URL:', error);
            // If we can't extract the file ID, return the original URL
            return url;
        }
    }

    /**
     * Gets the content type of a file based on its extension
     * @param {string} fileName - The name of the file
     * @returns {string} - The content type
     */
    getContentType(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();

        const contentTypes = {
            // Documents
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt': 'application/vnd.ms-powerpoint',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'txt': 'text/plain',
            'rtf': 'application/rtf',
            'odt': 'application/vnd.oasis.opendocument.text',
            'ods': 'application/vnd.oasis.opendocument.spreadsheet',
            'odp': 'application/vnd.oasis.opendocument.presentation',

            // Images
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'bmp': 'image/bmp',
            'svg': 'image/svg+xml',
            'webp': 'image/webp',

            // Videos
            'mp4': 'video/mp4',
            'mov': 'video/quicktime',
            'avi': 'video/x-msvideo',
            'wmv': 'video/x-ms-wmv',
            'flv': 'video/x-flv',
            'webm': 'video/webm',
            'mkv': 'video/x-matroska',

            // Audio
            'mp3': 'audio/mpeg',
            'wav': 'audio/wav',
            'ogg': 'audio/ogg',
            'aac': 'audio/aac',
            'flac': 'audio/flac',
        };

        return contentTypes[extension] || 'application/octet-stream';
    }
}

export default new ProxyService(); 