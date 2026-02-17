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
const LEGACY_DEV_HOST = 'http://192.168.100.202:8080';

function getApiBase(): string {
    return (import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/+$/, '');
}

function normalizeBackendFileUrl(input: string): string | undefined {
    const value = input.trim();
    if (!value) return undefined;

    // Common legacy persisted shapes we can safely normalize.
    // - ".../api/files/profile-pictures/<file>"
    // - ".../profile-pictures/<file>" (missing /api/files prefix)
    // - ".../uploads/profile-pictures/<file>"
    // - "profile-pictures/<file>" or "uploads/profile-pictures/<file>"
    const profileMarker = 'profile-pictures/';
    if (value.includes(profileMarker) && !value.includes('/api/files/profile-pictures/')) {
        const idx = value.lastIndexOf(profileMarker);
        const filename = value.substring(idx + profileMarker.length);
        if (filename) {
            const base = getApiBase();
            return `${base}/api/files/profile-pictures/${filename.replace(/^\/+/, '')}`;
        }
    }

    // If the URL already contains the correct public path, force the host to the configured API base.
    if (value.includes('/api/files/profile-pictures/')) {
        const base = getApiBase();
        const pathIdx = value.indexOf('/api/files/profile-pictures/');
        return `${base}${value.substring(pathIdx)}`;
    }

    return undefined;
}

export function resolveImageUrl(url?: string | null): string | undefined {
    if (!url) return undefined;

    const trimmed = url.trim();
    if (!trimmed) return undefined;

    // Ignore known backend placeholder value.
    if (trimmed.includes('default-admin.png')) return undefined;

    // Normalize legacy / inconsistent persisted URLs for backend-hosted profile pictures.
    const normalizedBackend = normalizeBackendFileUrl(trimmed);
    if (normalizedBackend) return normalizedBackend;

    // Migrate legacy dev URLs (old local IP) to the current API base URL
    if (trimmed.startsWith(LEGACY_DEV_HOST)) {
        const base = getApiBase();
        const path = trimmed.substring(LEGACY_DEV_HOST.length);
        if (!path) {
            return base;
        }
        if (path.startsWith('/')) {
            return `${base}${path}`;
        }
        return `${base}/${path}`;
    }

    if (
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('data:') ||
        trimmed.startsWith('blob:')
    ) {
        return trimmed;
    }

    const base = getApiBase();
    if (trimmed.startsWith('/')) {
        return `${base}${trimmed}`;
    }

    return `${base}/${trimmed}`;
}
