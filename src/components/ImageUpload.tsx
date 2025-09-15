import React, { useRef, useState, useEffect } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { UploadResponse } from '../services/images';

type Props = {
  uploader: (file: File) => Promise<UploadResponse>;
  onUploaded: (id: number) => void;
  onRemoved?: () => void;
  disabled?: boolean;
  maxSizeMb?: number;
  accept?: string;
};

const ImageUpload: React.FC<Props> = ({
  uploader,
  onUploaded,
  onRemoved,
  disabled = false,
  maxSizeMb = 10,
  accept = 'image/png, image/jpeg',
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPicker = () => inputRef.current?.click();

  const validate = (file: File) => {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      return 'Only JPG and PNG files are allowed.';
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      return `File too large (max ${maxSizeMb}MB).`;
    }
    return null;
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const msg = validate(file);
    if (msg) {
      setError(msg);
      return;
    }
    setError(null);

    const url = URL.createObjectURL(file);
    setLocalUrl(url);

    try {
      setUploading(true);
      const res = await uploader(file);
      console.log("Uploading result:", res);
      console.log("Passing to parent only id:", res.id);
      onUploaded(res.id);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setLocalUrl(null);
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const remove = () => {
    if (localUrl) URL.revokeObjectURL(localUrl);
    setLocalUrl(null);
    setError(null);
    onRemoved?.();
  };

  useEffect(() => {
    return () => {
      if (localUrl) URL.revokeObjectURL(localUrl);
    };
  }, [localUrl]);

  return (
    <Box
      sx={{
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={onChange}
        disabled={disabled || uploading}
      />

      <Stack spacing={2} alignItems="center">
        {!localUrl ? (
          <>
            <Typography variant="body1" color="text.secondary">
              Upload image (JPG/PNG, ≤ {maxSizeMb}MB)
            </Typography>
            <Button variant="contained" onClick={openPicker} disabled={disabled || uploading}>
              {uploading ? 'Uploading…' : 'Add image'}
            </Button>
          </>
        ) : (
          <>
            <Box
              component="img"
              src={localUrl}
              alt="preview"
              sx={{ maxWidth: 320, maxHeight: 240, borderRadius: 1 }}
            />
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={openPicker} disabled={disabled || uploading}>
                Replace
              </Button>
              <Button color="error" variant="outlined" onClick={remove} disabled={disabled || uploading}>
                Remove
              </Button>
            </Stack>
          </>
        )}

        {error && (
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default ImageUpload;