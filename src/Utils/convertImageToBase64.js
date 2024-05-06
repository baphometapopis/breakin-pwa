export const convertImageToBase64 = async (file) => {
  console.log(file)
  try {
    // Create a FileReader object
    const reader = new FileReader();

    // Define a Promise to handle asynchronous file reading
    const fileReaderPromise = new Promise((resolve, reject) => {
      reader.onload = () => {
        // Resolve the Promise with the base64 data when reading is completed
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        // Reject the Promise if an error occurs during reading
        reject(error);
      };
    });

    // Read the file as base64 data
    reader.readAsDataURL(file);

    // Wait for the Promise to resolve and return the base64 data
    return await fileReaderPromise;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};
