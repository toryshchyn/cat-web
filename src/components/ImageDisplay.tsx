import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  imageId?: number | null;
  alt?: string;
  width?: number | string;
  height?: number | string;
};

export function ImageDisplay({ imageId, alt = "", width = "100%", height = 120 }: Props) {
  const { getAccessTokenSilently } = useAuth0();
  const [url, setUrl] = useState<string>();
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
        });

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/image/${imageId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) {
          throw new Error("Failed to load image");
        }

        const blob = await res.blob();
        if (active) {
          const objectUrl = URL.createObjectURL(blob);
          setUrl(objectUrl);
          urlRef.current = objectUrl;
        }
      } catch (err) {
        console.error("ImageDisplay error:", err);
      }
    })();

    return () => {
      active = false;
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
      }
    };
  }, [imageId, getAccessTokenSilently]);

  if (!url) {
    return (
      <div
        style={{
          width,
          height,
          background: "#eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.8rem",
          color: "#999",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      style={{ width, height, objectFit: "cover", borderRadius: 4 }}
    />
  );
}
