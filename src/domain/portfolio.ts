import { PortfolioItem, DeliverableType } from '../types';

/**
 * Filter portfolio items by deliverable category and search text
 */
export function filterPortfolio(
  items: PortfolioItem[],
  category: DeliverableType | 'Semua',
  searchQuery: string = ''
): PortfolioItem[] {
  const query = searchQuery.trim().toLowerCase();

  return items.filter(item => {
    const categoryMatch = category === 'Semua' ? true : item.category === category;
    if (!categoryMatch) return false;

    if (!query) return true;

    const titleMatch = item.title.toLowerCase().includes(query);
    const descMatch = item.description.toLowerCase().includes(query);
    const clientMatch = item.courseOrClient.toLowerCase().includes(query);
    const tagMatch = item.tags.some(t => t.toLowerCase().includes(query));
    const softwareMatch = item.softwareUsed.some(s => s.toLowerCase().includes(query));

    return titleMatch || descMatch || clientMatch || tagMatch || softwareMatch;
  });
}

/**
 * Get items flagged as featured for top-level showcase
 */
export function getFeaturedPortfolio(items: PortfolioItem[]): PortfolioItem[] {
  return items.filter(i => i.featured);
}

/**
 * Calculate portfolio distribution and software metrics
 */
export function calculatePortfolioStats(items: PortfolioItem[]) {
  const total = items.length;
  const featuredCount = items.filter(i => i.featured).length;

  const softwareCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};

  items.forEach(item => {
    item.softwareUsed.forEach(sw => {
      softwareCounts[sw] = (softwareCounts[sw] || 0) + 1;
    });

    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });

  const topSoftware = Object.entries(softwareCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    total,
    featuredCount,
    topSoftware,
    categoryCounts,
  };
}
