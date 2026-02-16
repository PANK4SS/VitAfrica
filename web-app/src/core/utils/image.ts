/**
 * Compresses an image file and returns a smaller version (Blob).
 * Targets a maximum dimension of 800px and 0.7 quality.
 */
export async function compressImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                const MAX_SIZE = 800;
                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Image compression failed'));
                        }
                    },
                    'image/jpeg',
                    0.7
                );
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

const DEFAULT_API_BASE_URL = 'https://vitafrica-production.up.railway.app';

export function resolveImageUrl(url?: string | null): string | undefined {
    if (!url) return undefined;

    const trimmed = url.trim();
    if (!trimmed) return undefined;

    // Ignore known backend placeholder value.
    if (trimmed.includes('default-admin.png')) return undefined;

    if (
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('data:') ||
        trimmed.startsWith('blob:')
    ) {
        return trimmed;
    }

    const base = (import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/+$/, '');
    if (trimmed.startsWith('/')) {
        return `${base}${trimmed}`;
    }

    return `${base}/${trimmed}`;
}
