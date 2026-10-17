export interface Env {
  DEFAULT_IMGBB_API_KEY?: string;
}

export interface ImgBBImageMetadata {
  filename: string;
  name: string;
  mime: string;
  extension: string;
  url: string;
}

export interface ImgBBSuccessData {
  id: string;
  title: string;
  url_viewer: string;
  url: string;
  display_url: string;
  width: number | string;
  height: number | string;
  size: number | string;
  time: number | string;
  expiration: number | string;
  image: ImgBBImageMetadata;
  thumb?: ImgBBImageMetadata;
  medium?: ImgBBImageMetadata;
  delete_url: string;
}

export interface ImgBBApiResponse {
  data?: ImgBBSuccessData;
  success?: boolean;
  status?: number;
  status_code?: number;
  error?: {
    message: string;
    code: number;
  };
  status_txt?: string;
}

export interface UploadOptions {
  image: string; // URL, Base64 string, or data URI
  name?: string;
  expiration?: number; // 60 to 15,552,000 seconds
  apiKey?: string;
}

export interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: string | number | null;
  method: string;
  params?: any;
}

export interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: string | number | null;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}
