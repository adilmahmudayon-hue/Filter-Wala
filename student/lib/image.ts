
export function compressImage(file: File, maxW = 700): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = reject;

    reader.onload = () => {
      const img = new Image();

      img.onerror = reject;

      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);

        const c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);

        c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);

        resolve(c.toDataURL("image/jpeg", 0.6));
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
