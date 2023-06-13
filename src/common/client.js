import { QdrantClient } from '@qdrant/js-client-rest';



export default function qdrantClient({ apiKey }) {
  let url;
  if (process.env.NODE_ENV === "development") {
    url = "http://localhost:6333";
  } else {
    url = window.location.href;
  }
  let port=0;
  let options = {
    url,
    apiKey,
    port
  };

  return new QdrantClient(options)
}
