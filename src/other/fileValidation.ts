export function validateImage(file: File, maxSizeMb: number, accept: string[]): string | null {
  if (!accept.includes(file.type)) {
    return `Only ${accept.join(', ')} files are allowed.`;
  }

  if (file.size > maxSizeMb * 1024 * 1024) {
    return `File too large (max ${maxSizeMb}MB).`;
  }

  return null;
}
