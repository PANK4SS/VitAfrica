import { useEffect, useMemo, useState } from 'react';
import { User } from 'lucide-react';
import { resolveImageUrl } from '../../core/utils/image';

interface ProfileAvatarProps {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
}

export function ProfileAvatar({ src, alt, size = 40, className = '' }: ProfileAvatarProps) {
  const [loadFailed, setLoadFailed] = useState(false);
  const resolvedSrc = useMemo(() => resolveImageUrl(src), [src]);
  const showImage = Boolean(resolvedSrc) && !loadFailed;

  useEffect(() => {
    setLoadFailed(false);
  }, [src]);

  const baseStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  if (showImage) {
    return (
      <span className={`profile-avatar ${className}`.trim()} style={baseStyle}>
        <img src={resolvedSrc} alt={alt} onError={() => setLoadFailed(true)} />
      </span>
    );
  }

  return (
    <span className={`profile-avatar profile-avatar--placeholder ${className}`.trim()} style={baseStyle} aria-label={alt}>
      <User size={Math.max(14, Math.round(size * 0.45))} />
    </span>
  );
}
