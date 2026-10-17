import { JsonRpcRequest, JsonRpcResponse, UploadOptions } from './types';
import { uploadToImgBB, testImgBBConnection, formatImageMarkdown } from './imgbb';

export const MCP_SERVER_INFO = {
  name: 'imgbb-mcp-server',
  version: '1.0.0',
};

export const PROTOCOL_VERSION = '2024-11-05';

export const MCP_TOOLS = [
  {
    name: 'upload_image',
    description:
      'Upload an image to ImgBB. Accepts a public web URL, a base64 encoded string, or a data URI. Can optionally set a custom filename and expiration time (from 60 to 15,552,000 seconds). Returns direct image URL, viewer URL, thumbnail, dimensions, and delete link.',
    inputSchema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          description: 'The image to upload: a public URL (https://...), raw Base64 string, or data URI (data:image/...;base64,...)',
        },
        name: {
          type: 'string',
          description: 'Optional custom name/filename for the uploaded image (e.g., "header-banner")',
        },
        expiration: {
          type: 'integer',
          description: 'Optional expiration time in seconds (60 to 15,552,000 seconds). If omitted, image is stored indefinitely.',
        },
        apiKey: {
          type: 'string',
          description: 'Optional custom ImgBB API key. If omitted, uses the configured default API key.',
        },
      },
      required: ['image'],
    },
  },
  {
    name: 'upload_image_from_url',
    description: 'Upload an image directly from a public web URL to ImgBB with automatic anti-bot download fallback.',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The public web URL of the image (e.g. https://example.com/photo.jpg)',
        },
        name: {
          type: 'string',
          description: 'Optional custom filename for the uploaded image',
        },
        expiration: {
          type: 'integer',
          description: 'Optional expiration in seconds (60 to 15,552,000 seconds)',
        },
        apiKey: {
          type: 'string',
          description: 'Optional custom ImgBB API key',
        },
      },
      required: ['url'],
    },
  },
  {
    name: 'upload_image_base64',
    description: 'Upload a base64-encoded image to ImgBB.',
    inputSchema: {
      type: 'object',
      properties: {
        base64: {
          type: 'string',
          description: 'Base64 encoded image string (with or without data:image/...;base64, prefix)',
        },
        name: {
          type: 'string',
          description: 'Optional custom filename for the uploaded image',
        },
        expiration: {
          type: 'integer',
          description: 'Optional expiration in seconds (60 to 15,552,000 seconds)',
        },
        apiKey: {
          type: 'string',
          description: 'Optional custom ImgBB API key',
        },
      },
      required: ['base64'],
    },
  },
  {
    name: 'test_connection',
    description: 'Test connectivity and verify that the ImgBB API key is active and functional.',
    inputSchema: {
      type: 'object',
      properties: {
        apiKey: {
          type: 'string',
          description: 'Optional custom ImgBB API key to test. Defaults to server key.',
        },
      },
    },
  },
];

export const MCP_RESOURCES = [
  {
    uri: 'imgbb://limits',
    name: 'ImgBB API Limits & Specs',
    description: 'Details on supported formats, file size limits, and expiration rules',
    mimeType: 'application/json',
  },
  {
    uri: 'imgbb://capabilities',
    name: 'ImgBB MCP Capabilities',
    description: 'Overview of available tools and integrations',
    mimeType: 'text/markdown',
  },
];

export const MCP_PROMPTS = [
  {
    name: 'upload-and-embed',
    description: 'Guides the model on how to upload an image and present markdown and HTML embeds to the user',
    arguments: [
      {
        name: 'imageUrlOrBase64',
        description: 'The image URL or base64 data to upload',
        required: true,
      },
      {
        name: 'imageTitle',
        description: 'A friendly title or alt text for the image',
        required: false,
      },
    ],
  },
];

/**
 * Handles JSON-RPC 2.0 requests according to the Model Context Protocol
 */
export async function handleMcpRequest(
  request: JsonRpcRequest,
  defaultApiKey: string
): Promise<JsonRpcResponse | null> {
  const { id, method, params } = request;

  // Notification without ID (e.g. notifications/initialized) does not return a response
  if (id === undefined && method.startsWith('notifications/')) {
    return null;
  }

  const requestId = id !== undefined ? id : null;

  try {
    switch (method) {
      case 'initialize': {
        return {
          jsonrpc: '2.0',
          id: requestId,
          result: {
            protocolVersion: PROTOCOL_VERSION,
            capabilities: {
              tools: { listChanged: false },
              resources: { listChanged: false },
              prompts: { listChanged: false },
            },
            serverInfo: MCP_SERVER_INFO,
          },
        };
      }

      case 'notifications/initialized': {
        return null;
      }

      case 'ping': {
        return {
          jsonrpc: '2.0',
          id: requestId,
          result: {},
        };
      }

      case 'tools/list': {
        return {
          jsonrpc: '2.0',
          id: requestId,
          result: {
            tools: MCP_TOOLS,
          },
        };
      }

      case 'tools/call': {
        const toolName = params?.name;
        const args = params?.arguments || {};

        if (!toolName) {
          return {
            jsonrpc: '2.0',
            id: requestId,
            error: {
              code: -32602,
              message: 'Missing tool name in tools/call request',
            },
          };
        }

        switch (toolName) {
          case 'upload_image': {
            const image = args.image;
            if (!image || typeof image !== 'string') {
              return {
                jsonrpc: '2.0',
                id: requestId,
                result: {
                  content: [{ type: 'text', text: 'Error: Missing or invalid "image" parameter' }],
                  isError: true,
                },
              };
            }

            const data = await uploadToImgBB(
              {
                image,
                name: args.name,
                expiration: args.expiration,
                apiKey: args.apiKey,
              },
              defaultApiKey
            );

            return {
              jsonrpc: '2.0',
              id: requestId,
              result: {
                content: [
                  {
                    type: 'text',
                    text: formatImageMarkdown(data),
                  },
                ],
                structuredData: data,
                isError: false,
              },
            };
          }

          case 'upload_image_from_url': {
            const url = args.url;
            if (!url || typeof url !== 'string') {
              return {
                jsonrpc: '2.0',
                id: requestId,
                result: {
                  content: [{ type: 'text', text: 'Error: Missing or invalid "url" parameter' }],
                  isError: true,
                },
              };
            }

            const data = await uploadToImgBB(
              {
                image: url,
                name: args.name,
                expiration: args.expiration,
                apiKey: args.apiKey,
              },
              defaultApiKey
            );

            return {
              jsonrpc: '2.0',
              id: requestId,
              result: {
                content: [
                  {
                    type: 'text',
                    text: formatImageMarkdown(data),
                  },
                ],
                structuredData: data,
                isError: false,
              },
            };
          }

          case 'upload_image_base64': {
            const base64 = args.base64;
            if (!base64 || typeof base64 !== 'string') {
              return {
                jsonrpc: '2.0',
                id: requestId,
                result: {
                  content: [{ type: 'text', text: 'Error: Missing or invalid "base64" parameter' }],
                  isError: true,
                },
              };
            }

            const data = await uploadToImgBB(
              {
                image: base64,
                name: args.name,
                expiration: args.expiration,
                apiKey: args.apiKey,
              },
              defaultApiKey
            );

            return {
              jsonrpc: '2.0',
              id: requestId,
              result: {
                content: [
                  {
                    type: 'text',
                    text: formatImageMarkdown(data),
                  },
                ],
                structuredData: data,
                isError: false,
              },
            };
          }

          case 'test_connection': {
            const apiKeyToTest = args.apiKey || defaultApiKey;
            const res = await testImgBBConnection(apiKeyToTest);
            return {
              jsonrpc: '2.0',
              id: requestId,
              result: {
                content: [
                  {
                    type: 'text',
                    text: res.success
                      ? `✅ Connection verified: ${res.message}\nTest Image: ${res.details?.testUrl}`
                      : `❌ Connection check failed: ${res.message}`,
                  },
                ],
                isError: !res.success,
              },
            };
          }

          default:
            return {
              jsonrpc: '2.0',
              id: requestId,
              error: {
                code: -32601,
                message: `Tool not found: ${toolName}`,
              },
            };
        }
      }

      case 'resources/list': {
        return {
          jsonrpc: '2.0',
          id: requestId,
          result: {
            resources: MCP_RESOURCES,
          },
        };
      }

      case 'resources/read': {
        const uri = params?.uri;
        if (uri === 'imgbb://limits') {
          return {
            jsonrpc: '2.0',
            id: requestId,
            result: {
              contents: [
                {
                  uri,
                  mimeType: 'application/json',
                  text: JSON.stringify(
                    {
                      max_file_size_mb: 32,
                      expiration_range_seconds: { min: 60, max: 15552000, default: 'permanent' },
                      supported_formats: ['JPG', 'PNG', 'BMP', 'GIF', 'TIF', 'WEBP', 'HEIC', 'PDF'],
                      upload_types: ['URL', 'Base64', 'Multipart/Binary'],
                    },
                    null,
                    2
                  ),
                },
              ],
            },
          };
        }

        if (uri === 'imgbb://capabilities') {
          return {
            jsonrpc: '2.0',
            id: requestId,
            result: {
              contents: [
                {
                  uri,
                  mimeType: 'text/markdown',
                  text: `# ImgBB MCP Server Capabilities
- **upload_image**: Primary tool to upload any image (URL, base64, data URI).
- **upload_image_from_url**: Dedicated URL upload with automatic bot-block bypass.
- **upload_image_base64**: Base64 image uploader.
- **test_connection**: Live API verification test.
`,
                },
              ],
            },
          };
        }

        return {
          jsonrpc: '2.0',
          id: requestId,
          error: {
            code: -32602,
            message: `Resource not found: ${uri}`,
          },
        };
      }

      case 'prompts/list': {
        return {
          jsonrpc: '2.0',
          id: requestId,
          result: {
            prompts: MCP_PROMPTS,
          },
        };
      }

      case 'prompts/get': {
        const promptName = params?.name;
        if (promptName === 'upload-and-embed') {
          const imageSrc = params?.arguments?.imageUrlOrBase64 || '{{image}}';
          const title = params?.arguments?.imageTitle || 'Uploaded Image';
          return {
            jsonrpc: '2.0',
            id: requestId,
            result: {
              description: 'Guide for uploading and embedding an image',
              messages: [
                {
                  role: 'user',
                  content: {
                    type: 'text',
                    text: `Please upload the following image to ImgBB and provide clean markdown and direct links:\nImage: ${imageSrc}\nTitle: ${title}`,
                  },
                },
              ],
            },
          };
        }

        return {
          jsonrpc: '2.0',
          id: requestId,
          error: {
            code: -32601,
            message: `Prompt not found: ${promptName}`,
          },
        };
      }

      default:
        return {
          jsonrpc: '2.0',
          id: requestId,
          error: {
            code: -32601,
            message: `Method not found: ${method}`,
          },
        };
    }
  } catch (err: any) {
    return {
      jsonrpc: '2.0',
      id: requestId,
      result: {
        content: [{ type: 'text', text: `Execution failed: ${err.message || String(err)}` }],
        isError: true,
      },
    };
  }
}
