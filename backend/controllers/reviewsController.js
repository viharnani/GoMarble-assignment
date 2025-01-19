import { scrapeReviews } from '../services/playwrightService.js';
import { logReviewDetails } from '../helpers/logReviewDetails.js';

export const getReviews = async (req, res) => {
  const { url, numReviews = 5 } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const reviews = await scrapeReviews(url, numReviews);
    logReviewDetails(reviews);

    return res.json({
      numReviews: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
};
