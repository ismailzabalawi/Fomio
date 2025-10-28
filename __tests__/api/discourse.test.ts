import { discourseApi } from '../../api';

describe('DiscourseApi (Stub)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Stub API', () => {
    it('should return empty data for getLatestTopics', async () => {
      const result = await discourseApi.getLatestTopics();
      expect(result).toEqual({ topic_list: { topics: [] } });
    });

    it('should return null user for getCurrentUser when not authenticated', async () => {
      const result = await discourseApi.getCurrentUser();
      expect(result.user).toBeNull();
    });

    it('should return empty data for getCategories', async () => {
      const result = await discourseApi.getCategories();
      expect(result).toEqual({ category_list: { categories: [] } });
    });

    it('should return false for isAuthenticated', () => {
      expect(discourseApi.isAuthenticated()).toBe(false);
    });

    it('should return success for logout', async () => {
      const result = await discourseApi.logout();
      expect(result).toEqual({ success: true });
    });
  });
});
