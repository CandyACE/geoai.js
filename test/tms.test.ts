import { describe, expect, it, beforeAll, beforeEach } from 'vitest';
import { Tms } from '../src/data_providers/tms';
import { GeoRawImage } from '../src/types/images/GeoRawImage';

describe('Tms', () => {
  let tms: Tms;
  let testPolygon: GeoJSON.Feature;
  let image: GeoRawImage;

  beforeAll(() => {
    tms = new Tms({
      baseUrl: 'https://tile.openstreetmap.org',
      extension: 'png',
      attribution: 'OpenStreetMap',
    });
  });

  beforeEach(() => {
    testPolygon = {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          [
            [12.482802629103247, 41.885379230564524],
            [12.481392196198271, 41.885379230564524],
            [12.481392196198271, 41.884332326712524],
            [12.482802629103247, 41.884332326712524],
            [12.482802629103247, 41.885379230564524],
          ],
        ],
        type: 'Polygon',
      },
    } as GeoJSON.Feature;
  });

  describe('getImage', () => {
    beforeEach(async () => {
      image = (await tms.getImage(testPolygon)) as GeoRawImage;
    });

    it('should return a valid GeoRawImage instance', () => {
      expect(image).toBeDefined();
      expect(image).not.toBeNull();
      expect(image).toBeInstanceOf(GeoRawImage);
    });

    it('should return image with correct dimensions and properties', () => {
      expect(image.width).toBeGreaterThan(0);
      expect(image.height).toBeGreaterThan(0);
      expect(image.channels).toBe(3); // RGB image
      expect(image.data).toBeDefined();
      expect(image.data).not.toBeNull();
      expect(image.data.length).toBeGreaterThan(0);
    });

    it('should return image with bounds matching input polygon', () => {
      const bounds = image.getBounds();
      expect(bounds).toBeDefined();
      expect(bounds).not.toBeNull();

      // Expected bounds for the test polygon
      const expectedBounds = {
        north: 41.885921,
        south: 41.883876,
        east: 12.483216,
        west: 12.480469,
      };

      expect(bounds.west).toBeCloseTo(expectedBounds.west, 6);
      expect(bounds.east).toBeCloseTo(expectedBounds.east, 6);
      expect(bounds.south).toBeCloseTo(expectedBounds.south, 6);
      expect(bounds.north).toBeCloseTo(expectedBounds.north, 6);
    });

    it('should handle invalid polygon gracefully', async () => {
      const invalidPolygon = {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [],
          type: 'Polygon',
        },
      } as GeoJSON.Feature;

      await expect(tms.getImage(invalidPolygon)).rejects.toThrow();
    });
  });

  describe('Tile URL generation', () => {
    let testTms: Tms;

    beforeAll(() => {
      testTms = new Tms({
        baseUrl: 'https://tile.openstreetmap.org',
        extension: 'png',
        attribution: 'OpenStreetMap',
      });
    });

    it('should generate correct tile URLs with TMS Y-coordinate flipping', () => {
      const getTileUrl = testTms.getTileUrlFromTileCoords.bind(testTms);
      const url = getTileUrl([123, 456, 18], testTms);

      // For TMS, Y coordinate should be flipped: tmsY = (2^z - 1) - y
      // For z=18, y=456: tmsY = (2^18 - 1) - 456 = 262143 - 456 = 261687
      expect(url).toBe('https://tile.openstreetmap.org/18/123/261687.png');
    });

    it('should handle different extensions', () => {
      const jpgTms = new Tms({
        baseUrl: 'https://example.com/tiles',
        extension: 'jpg',
        attribution: 'Example',
      });

      const getTileUrl = jpgTms.getTileUrlFromTileCoords.bind(jpgTms);
      const url = getTileUrl([100, 200, 15], jpgTms);

      // For z=15, y=200: tmsY = (2^15 - 1) - 200 = 32767 - 200 = 32567
      expect(url).toBe('https://example.com/tiles/15/100/32567.jpg');
    });

    it('should handle API key as query parameter', () => {
      const tmsWithKey = new Tms({
        baseUrl: 'https://example.com/tiles',
        extension: 'png',
        apiKey: 'test-api-key-123',
        attribution: 'Example',
      });

      const getTileUrl = tmsWithKey.getTileUrlFromTileCoords.bind(tmsWithKey);
      const url = getTileUrl([10, 20, 5], tmsWithKey);

      // For z=5, y=20: tmsY = (2^5 - 1) - 20 = 31 - 20 = 11
      expect(url).toBe('https://example.com/tiles/5/10/11.png?apikey=test-api-key-123');
    });

    it('should handle custom tile size', () => {
      const customTms = new Tms({
        baseUrl: 'https://example.com/tiles',
        extension: 'png',
        attribution: 'Example',
        tileSize: 512,
      });

      expect(customTms.tileSize).toBe(512);
    });
  });

  describe('Configuration', () => {
    it('should accept valid configuration', () => {
      const config = {
        baseUrl: 'https://tile.example.com',
        extension: 'jpg',
        attribution: 'Example Provider',
        tileSize: 256,
      };

      const tmsInstance = new Tms(config);
      expect(tmsInstance.baseUrl).toBe(config.baseUrl);
      expect(tmsInstance.extension).toBe(config.extension);
      expect(tmsInstance.attribution).toBe(config.attribution);
      expect(tmsInstance.tileSize).toBe(config.tileSize);
    });

    it('should use default extension when not specified', () => {
      const config = {
        baseUrl: 'https://tile.example.com',
        attribution: 'Example Provider',
      };

      const tmsInstance = new Tms(config);
      expect(tmsInstance.extension).toBe('png'); // Default extension
    });

    it('should use default tile size when not specified', () => {
      const config = {
        baseUrl: 'https://tile.example.com',
        attribution: 'Example Provider',
      };

      const tmsInstance = new Tms(config);
      expect(tmsInstance.tileSize).toBe(256); // Default tile size
    });

    it('should use default attribution when not specified', () => {
      const config = {
        baseUrl: 'https://tile.example.com',
      };

      const tmsInstance = new Tms(config);
      expect(tmsInstance.attribution).toBe('TMS Provider');
    });

    it('should handle custom headers', () => {
      const config = {
        baseUrl: 'https://tile.example.com',
        headers: {
          Authorization: 'Bearer token123',
          'X-Custom-Header': 'value',
        },
      };

      const tmsInstance = new Tms(config);
      expect(tmsInstance.headers).toEqual(config.headers);
    });
  });
});
