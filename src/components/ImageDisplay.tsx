import { useAuth0 } from "@auth0/auth0-react";
import { useProtectedImage } from "../hooks/useProtectedImage";

type Props = {
  imageId?: number | null;
  alt?: string;
  width?: number | string;
  height?: number | string;
};

export function ImageDisplay({ imageId, alt = "", width = "100%", height = 120 }: Props) {
  const { getAccessTokenSilently } = useAuth0();

  const url = useProtectedImage(
    imageId ? `${import.meta.env.VITE_API_BASE_URL}/api/image/${imageId}` : undefined,
    () =>
      getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
      })
  );

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

  return <img src={url} alt={alt} style={{ width, height, objectFit: "cover", borderRadius: 4 }} />;
}
