import { useEffect, useState } from 'react';

function getHashPath(): string {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/';
}

export function navigateTo(path: string): void {
  window.location.hash = path;
}

export function useHashPath(): string {
  const [path, setPath] = useState<string>(() => getHashPath());

  useEffect(() => {
    const onHashChange = () => setPath(getHashPath());
    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  return path;
}
