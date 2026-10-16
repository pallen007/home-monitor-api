import request from 'supertest';
import { afterEach, describe, expect, test, vi } from 'vitest';
import app from '../index';

afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
});

describe('Perenual API proxy', () => {
    test('forwards search parameters and keeps the API key out of the browser response', async () => {
        vi.stubEnv('PERENUAL_API_KEY', 'test-secret');
        const upstreamBody = { data: [{ id: 42, common_name: 'Test plant' }] };
        const upstreamFetch = vi.fn().mockResolvedValue({
            status: 200,
            json: async () => upstreamBody,
        });
        vi.stubGlobal('fetch', upstreamFetch);

        const response = await request(app).get('/api/perenual/search?query=fern&indoor=false');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(upstreamBody);
        const upstreamUrl = new URL(upstreamFetch.mock.calls[0][0]);
        expect(upstreamUrl.pathname).toBe('/api/v2/species-list');
        expect(upstreamUrl.searchParams.get('query')).toBe('fern');
        expect(upstreamUrl.searchParams.get('indoor')).toBe('false');
        expect(upstreamUrl.searchParams.get('key')).toBe('test-secret');
        expect(JSON.stringify(response.body)).not.toContain('test-secret');
    });

    test('returns a configuration error when the server API key is missing', async () => {
        vi.stubEnv('PERENUAL_API_KEY', '');

        const response = await request(app).get('/api/perenual/search');

        expect(response.status).toBe(503);
        expect(response.body.error).toBe('Perenual API is not configured');
    });

    test('forwards species details and disease searches with the server API key', async () => {
        vi.stubEnv('PERENUAL_API_KEY', 'test-secret');
        const upstreamFetch = vi.fn().mockResolvedValue({
            status: 200,
            json: async () => ({ data: [] }),
        });
        vi.stubGlobal('fetch', upstreamFetch);

        await request(app).get('/api/perenual/species/42');
        await request(app).get('/api/perenual/diseases/42?query=spot');

        const detailUrl = new URL(upstreamFetch.mock.calls[0][0]);
        expect(detailUrl.pathname).toBe('/api/v2/species/details/42');
        expect(detailUrl.searchParams.get('key')).toBe('test-secret');

        const diseaseUrl = new URL(upstreamFetch.mock.calls[1][0]);
        expect(diseaseUrl.pathname).toBe('/api/pest-disease-list');
        expect(diseaseUrl.searchParams.get('id')).toBe('42');
        expect(diseaseUrl.searchParams.get('query')).toBe('spot');
        expect(diseaseUrl.searchParams.get('key')).toBe('test-secret');
    });
});