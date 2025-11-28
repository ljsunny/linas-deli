// utils/base64ToBlob.ts
export function base64ToBlob(base64Data: string, contentType = "image/jpeg") {
    const byteString = atob(base64Data.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: contentType });
  }