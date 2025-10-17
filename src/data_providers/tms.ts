import { MapSource } from './mapsource';

interface TmsConfig {
  baseUrl: string;
  extension?: string;
  apiKey?: string;
  attribution?: string;
  tileSize?: number;
  headers?: Record<string, string>;
}

export class Tms extends MapSource {
  baseUrl: string;
  extension: string;
  apiKey?: string;
  attribution: string;
  tileSize: number;
  headers?: Record<string, string>;

  constructor(config: TmsConfig) {
    super();
    this.baseUrl = config.baseUrl;
    this.extension = config.extension || 'png';
    this.apiKey = config.apiKey;
    this.attribution = config.attribution || 'TMS Provider';
    this.tileSize = config.tileSize || 256;
    this.headers = config.headers;
  }

  protected getTileUrlFromTileCoords(
    tileCoords: [number, number, number],
    instance: Tms
  ): string {
    const [x, y, z] = tileCoords;
    // TMS uses bottom-left origin, so we need to flip Y coordinate
    const tmsY = Math.pow(2, z) - 1 - y;
    
    let url: string;
    
    // Check if baseUrl contains placeholders {x}, {y}, {z}
    if (instance.baseUrl.includes('{x}') || instance.baseUrl.includes('{y}') || instance.baseUrl.includes('{z}')) {
      // Use placeholder-based URL template
      url = instance.baseUrl
        .replaceAll('{z}', z.toString())
        .replaceAll('{x}', x.toString())
        .replaceAll('{y}', tmsY.toString());
    } else {
      // Use traditional baseUrl + path construction for backward compatibility
      url = `${instance.baseUrl}/${z}/${x}/${tmsY}.${instance.extension}`;
    }
    
    // Add API key as query parameter if provided
    if (instance.apiKey) {
      url += `?apikey=${instance.apiKey}`;
    }
    
    return url;
  }
}
