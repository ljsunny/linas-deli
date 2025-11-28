export const resizeImage = (file: File, maxSize = 800): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = height * (maxSize / width);
          width = maxSize;
        } else {
          width = width * (maxSize / height);
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("canvas context error");

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject("blob conversion error");
      }, "image/jpeg", 0.7); // 0.7 = 압축률 (0~1)
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};