import React, { useRef, useState, useEffect } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { UploadResponse } from "../services/image-api-service";
import { validateImage } from "../other/fileValidation";
import { useProtectedImage } from "../hooks/useProtectedImage";

type Props = {
  uploader: (file: File) => Promise<UploadResponse>;
  onUploaded: (id: number) => void;
  onRemoved?: () => void;
  disabled?: boolean;
  maxSizeMb?: number;
  accept?: string[];
  initialImageId?: number | null;
  initialImageUrl?: string | null;
  getAccessToken?: () => Promise<string>;
};

const ImageUpload: React.FC<Props> = ({
  uploader,
  onUploaded,
  onRemoved,
  disabled = false,
  maxSizeMb = 10,
  accept = ["image/png", "image/jpeg"],
  initialImageUrl,
  initialImageId,
  getAccessToken,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const protectedUrl = useProtectedImage(initialImageUrl ?? undefined, getAccessToken);

  const openPicker = () => inputRef.current?.click();

  const handleFile = async (file: File) => {
    const errorMessage = validateImage(file, maxSizeMb, accept);
    if (errorMessage) {
      return setError(errorMessage);
    }

    setError(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    try {
      setUploading(true);
      const response = await uploader(file);
      onUploaded(response.id);
    } catch (error) {
      setPreviewUrl(null);
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const remove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setError(null);
    onRemoved?.();
  };

  useEffect(() => {
    if (protectedUrl) {
      setPreviewUrl(protectedUrl);
    }
  }, [protectedUrl]);

  useEffect(() => {
    if (!initialImageId) {
      setPreviewUrl(null);
    }
  }, [initialImageId]);

  return (
    <Box
      sx={{
        border: "2px dashed",
        borderColor: "divider",
        borderRadius: 2,
        p: 3,
        textAlign: "center",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept.join(",")}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFile(file);
          }
        }}
        disabled={disabled || uploading}
      />

      <Stack spacing={2} alignItems="center">
        {!previewUrl ? (
          <>
            <Typography variant="body1" color="text.secondary">
              Upload image ({accept.join(", ")}, ≤ {maxSizeMb}MB)
            </Typography>
            <Button variant="contained" onClick={openPicker} disabled={disabled || uploading}>
              {uploading ? "Uploading…" : "Add image"}
            </Button>
          </>
        ) : (
          <>
            <Box
              component="img"
              src={previewUrl}
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
