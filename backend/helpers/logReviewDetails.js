export function logReviewDetails(reviews) {
    console.log('\n=== Review Details ===\n');
    reviews.forEach((review, index) => {
      console.log(`Review #${index + 1}`);
      console.log('Reviewer:', review.reviewer);
      console.log('Rating:', '⭐'.repeat(Math.min(review.rating, 5)));
      console.log('Date:', review.date);
      console.log('Review:', review.body);
      console.log('-------------------\n');
    });
    console.log(`Total Reviews: ${reviews.length}\n`);
  }
  