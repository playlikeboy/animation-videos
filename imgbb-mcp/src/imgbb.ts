import { ImgBBApiResponse, ImgBBSuccessData, UploadOptions } from './types';

const IMGBB_UPLOAD_ENDPOINT = 'https://api.imgbb.com/1/upload';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

/**
 * Checks if a string is an HTTP/HTTPS URL
 */
function isHttpUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Normalizes image input: cleans data URI prefix if present
 */
function normalizeImagePayload(imageStr: string): string {
  const trimmed = imageStr.trim();
  const dataUriMatch = trimmed.match(/^data:image\/[a-zA-Z+.-]+;base64,(.+)$/s);
  if (dataUriMatch && dataUriMatch[1]) {
    return dataUriMatch[1];
  }
  return trimmed;
}

/**
 * Converts an ArrayBuffer to a Base64 string in Cloudflare Workers
 */
function bufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  const chunkSize = 8192;
  for (let i = 0; i < len; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + chunkSize, len)));
  }
  return btoa(binary);
}

/**
 * Fallback: fetch image remotely and convert to base64 if ImgBB fails to download URL directly
 */
async function fetchRemoteImageAsBase64(url: string): Promise<string> {
  const resp = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    },
  });

  if (!resp.ok) {
    throw new Error(`Failed to fetch remote image from ${url}: HTTP ${resp.status} ${resp.statusText}`);
  }

  const arrayBuffer = await resp.arrayBuffer();
  return bufferToBase64(arrayBuffer);
}

/**
 * Core function to send upload request to ImgBB
 */
async function sendToImgBB(apiKey: string, imagePayload: string, name?: string, expiration?: number): Promise<ImgBBApiResponse> {
  const params = new URLSearchParams();
  params.append('image', imagePayload);

  if (name && name.trim()) {
    params.append('name', name.trim());
  }

  if (expiration && Number.isInteger(expiration) && expiration >= 60 && expiration <= 15552000) {
    params.append('expiration', expiration.toString());
  }

  const targetUrl = `${IMGBB_UPLOAD_ENDPOINT}?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': USER_AGENT,
      'Accept': 'application/json',
    },
    body: params.toString(),
  });

  const rawText = await response.text();
  try {
    return JSON.parse(rawText) as ImgBBApiResponse;
  } catch {
    throw new Error(`ImgBB returned non-JSON response (HTTP ${response.status}): ${rawText.slice(0, 300)}`);
  }
}

/**
 * Uploads an image to ImgBB with automatic URL fallback handling
 */
export async function uploadToImgBB(options: UploadOptions, defaultApiKey: string): Promise<ImgBBSuccessData> {
  const apiKey = (options.apiKey && options.apiKey.trim()) || defaultApiKey;
  if (!apiKey) {
    throw new Error('ImgBB API key is missing. Please provide apiKey parameter or configure DEFAULT_IMGBB_API_KEY.');
  }

  const cleanPayload = normalizeImagePayload(options.image);
  const isUrl = isHttpUrl(cleanPayload);

  let result = await sendToImgBB(apiKey, cleanPayload, options.name, options.expiration);

  // If passing URL directly caused ImgBB code 105 (Can't download remote image), attempt client-side fetch fallback
  if (!result.success && isUrl && (result.error?.code === 105 || result.status_code === 400)) {
    try {
      const base64Data = await fetchRemoteImageAsBase64(cleanPayload);
      result = await sendToImgBB(apiKey, base64Data, options.name, options.expiration);
    } catch (fallbackError: any) {
      throw new Error(`ImgBB upload failed: ${result.error?.message || 'Download error'} (Remote fetch fallback also failed: ${fallbackError.message})`);
    }
  }

  if (!result.success || !result.data) {
    const errorMsg = result.error?.message || result.status_txt || 'Unknown error from ImgBB';
    const errorCode = result.error?.code || result.status_code || 500;
    throw new Error(`ImgBB Error [${errorCode}]: ${errorMsg}`);
  }

  return result.data;
}

/**
 * Validates the connection with ImgBB by uploading a 1x1 transparent test pixel
 */
export async function testImgBBConnection(apiKey: string): Promise<{ success: boolean; message: string; details?: any }> {
  // 1x1 valid PNG pixel
  const validPixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4z8AAAAMBAQAY3Y2wAAAAAElFTkSuQmCC';
  try {
    const data = await uploadToImgBB(
      {
        image: validPixelBase64,
        name: 'mcp_connection_test',
        apiKey,
      },
      apiKey
    );
    return {
      success: true,
      message: 'ImgBB API key is valid and connection is verified!',
      details: {
        id: data.id,
        testUrl: data.url,
        deleteUrl: data.delete_url,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: `ImgBB API connection check failed: ${error.message}`,
    };
  }
}

/**
 * Formats ImgBB image metadata into a comprehensive markdown report for AI agents
 */
export function formatImageMarkdown(data: ImgBBSuccessData): string {
  const title = data.title || data.image?.filename || 'Image';
  const directUrl = data.url;
  const viewerUrl = data.url_viewer;
  const thumbUrl = data.thumb?.url || data.display_url;
  const deleteUrl = data.delete_url;
  const dimensions = `${data.width}x${data.height}`;
  const sizeKb = typeof data.size === 'number' ? (data.size / 1024).toFixed(2) : (parseInt(String(data.size), 10) / 1024).toFixed(2);
  const expirationText = Number(data.expiration) > 0 ? `${data.expiration}s` : 'Permanent';

  return `### ✅ Image Uploaded Successfully to ImgBB

- **Title/Name**: \`${title}\`
- **Direct Image URL**: [${directUrl}](${directUrl})
- **Viewer URL**: [${viewerUrl}](${viewerUrl})
- **Thumbnail URL**: [${thumbUrl}](${thumbUrl})
- **Dimensions**: \`${dimensions} px\`
- **File Size**: \`${sizeKb} KB\`
- **Expiration**: \`${expirationText}\`
- **Delete URL**: [${deleteUrl}](${deleteUrl})

#### Embed Codes:
- **Markdown**: \`![${title}](${directUrl})\`
- **HTML**: \`<img src="${directUrl}" alt="${title}" />\`
- **BBCode**: \`[img]${directUrl}[/img]\`
`;
}
