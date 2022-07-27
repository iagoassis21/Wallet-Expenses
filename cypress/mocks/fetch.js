import { mockData } from './data';

const mockFetch = () => Promise.resolve({
  status: 200,
  ok: true,
  json: () => Promise.resolve(mockData),
});

export default mockFetch;
