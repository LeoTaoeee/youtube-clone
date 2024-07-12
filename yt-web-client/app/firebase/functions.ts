import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

const generateUploadUrlFunction = httpsCallable(functions, 'generateUploadUrl');

export async function uploadVideo(file: File) {
  const response: any = await generateUploadUrlFunction({
    //await means that uploadResult wont be run until we have response
    //pass in file extension
    fileExtension: file.name.split('.').pop()
  });

  // Upload the file to the signed URL
  // the ? means dont continue if its undefined
  const uploadResult = await fetch(response?.data?.url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  return uploadResult;
}
