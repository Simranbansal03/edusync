// import axios from 'axios';

// /**
//  * Uploads a file to the server
//  * @param {File} file - The file to upload
//  * @param {Function} progressCallback - Callback for upload progress
//  * @param {string} token - Authentication token (optional)
//  * @returns {Promise<string>} - The URL of the uploaded file
//  */
// export const uploadFile = async (file, progressCallback = null, token = null) => {
//     try {
//         const formData = new FormData();
//         formData.append('file', file);

//         const headers = {};
//         if (token) {
//             headers['Authorization'] = `Bearer ${token}`;
//         }

//         console.log(`Uploading file ${file.name} (${file.size} bytes) to ${window.API_CONFIG.BASE_URL}/api/CourseModels/upload`);

//         const response = await axios.post(
//             `${window.API_CONFIG.BASE_URL}/api/CourseModels/upload`,
//             formData,
//             {
//                 headers,
//                 onUploadProgress: progressCallback ? (progressEvent) => {
//                     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                     progressCallback(percentCompleted);
//                 } : undefined
//             }
//         );

//         console.log('Server response:', response.data);

//         // Check for either url or fileUrl in the response
//         let fileUrl = null;
//         if (response.data) {
//             // Try to get the URL from either the 'url' or 'fileUrl' property
//             fileUrl = response.data.url || response.data.fileUrl;
//             console.log('Raw fileUrl from response:', fileUrl);
//         }

//         if (!fileUrl) {
//             console.error('No URL returned from server:', response.data);
//             return null;
//         }

//         // Return the file path as is - don't add the domain
//         // The backend expects just the path for storage in the database
//         console.log('Final fileUrl to be returned:', fileUrl);
//         return fileUrl;
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         throw error;
//     }
// };

// /**
//  * Gets the file type from a file object
//  * @param {File} file - The file object
//  * @returns {string} - The file type category (document, image, video, audio, other)
//  */
// export const getFileType = (file) => {
//     const extension = file.name.split('.').pop().toLowerCase();

//     const documentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'ods', 'odp'];
//     const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
//     const videoTypes = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm', 'mkv'];
//     const audioTypes = ['mp3', 'wav', 'ogg', 'aac', 'flac'];

//     if (documentTypes.includes(extension)) return 'document';
//     if (imageTypes.includes(extension)) return 'image';
//     if (videoTypes.includes(extension)) return 'video';
//     if (audioTypes.includes(extension)) return 'audio';

//     return 'other';
// }; 


import axios from 'axios';

/**
 * Uploads a file to the server using Azure Blob Storage
 * @param {File} file - The file to upload
 * @param {Function} progressCallback - Callback for upload progress
 * @param {string} token - Authentication token (optional)
 * @param {string} courseId - Course ID for associating the file with a specific course (optional)
 * @returns {Promise<string>} - The URL of the uploaded file in Azure Blob Storage
 */
export const uploadFile = async (file, progressCallback = null, token = null, courseId = null) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Determine the endpoint based on whether we have a courseId
        const endpoint = courseId
            ? `${window.API_CONFIG.BASE_URL}/api/CourseModels/upload/${courseId}`
            : `${window.API_CONFIG.BASE_URL}/api/CourseModels/upload`;

        console.log(`Uploading file ${file.name} (${file.size} bytes) to ${endpoint}`);

        const response = await axios.post(
            endpoint,
            formData,
            {
                headers,
                onUploadProgress: progressCallback ? (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    progressCallback(percentCompleted);
                } : undefined
            }
        );

        console.log('Azure Blob Storage response:', response.data);

        // Check for the url in the response
        let fileUrl = null;
        if (response.data) {
            // Get the URL from the 'url' property
            fileUrl = response.data.url;
            console.log('Azure Blob Storage URL from response:', fileUrl);
        }

        if (!fileUrl) {
            console.error('No URL returned from server:', response.data);
            return null;
        }

        // Return the Azure Blob Storage URL
        console.log('Final Azure Blob URL to be returned:', fileUrl);
        return fileUrl;
    } catch (error) {
        console.error('Error uploading file to Azure Blob Storage:', error);
        throw error;
    }
};

/**
 * Gets the file type from a file object
 * @param {File} file - The file object
 * @returns {string} - The file type category (document, image, video, audio, other)
 */
export const getFileType = (file) => {
    const extension = file.name.split('.').pop().toLowerCase();

    const documentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'ods', 'odp'];
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    const videoTypes = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm', 'mkv'];
    const audioTypes = ['mp3', 'wav', 'ogg', 'aac', 'flac'];

    if (documentTypes.includes(extension)) return 'document';
    if (imageTypes.includes(extension)) return 'image';
    if (videoTypes.includes(extension)) return 'video';
    if (audioTypes.includes(extension)) return 'audio';

    return 'other';
};