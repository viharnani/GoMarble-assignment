import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

export async function extractSelectors(reviewChunks) {
  let selectors = {};
  let selectorsFound = false;

  for (let i = 0; i < reviewChunks.length; i++) {
    if (selectorsFound) {
      console.log('All selectors found. Skipping remaining chunks.');
      break;
    }

    console.log(`Processing chunk ${i + 1} of ${reviewChunks.length}`);
    const prompt = `
      Analyze this HTML chunk and identify CSS selectors for review elements.
      Return the CSS selectors for the following:
      - container: The outer container of the review element.
      - name: The selector for the reviewer name.
      - rating: The selector for the rating element.
      - review: The selector for the review text.
      - date: The selector for the review date.
      - nextPageSelector: The selector for the "next page" button.

      Only return valid CSS selectors in this JSON format:
      {
        "container": ".selector",
        "name": ".selector",
        "rating": ".selector",
        "review": ".selector",
        "date": ".selector",
        "nextPageSelector": ".selector"
      }
      HTML Chunk:
      ${reviewChunks[i]}
    `;

    try {
      const result = await model.generateContent(prompt, { temperature: 0 });
      const response = result.response.text().trim();

      if (response) {
        const jsonStr = response.replace(/```json\n?|\n?```/g, '').trim();
        console.log(`Model response for chunk ${i + 1}:`, jsonStr);

        try {
          const chunkSelectors = JSON.parse(jsonStr);

          selectors = {
            container: chunkSelectors.container || selectors.container,
            name: chunkSelectors.name || selectors.name,
            rating: chunkSelectors.rating || selectors.rating,
            review: chunkSelectors.review || selectors.review,
            date: chunkSelectors.date || selectors.date,
            nextPageSelector: chunkSelectors.nextPageSelector || selectors.nextPageSelector,
          };

          selectorsFound = Object.values(selectors).every((selector) => !!selector);
          if (selectorsFound) {
            console.log('All required selectors found:', selectors);
          }
        } catch (error) {
          console.error('Error parsing JSON response:', error);
        }
      }
    } catch (error) {
      console.error(`Error processing chunk ${i + 1}:`, error);
    }
  }

  if (!selectorsFound) {
    console.warn('Failed to find all required selectors.');
  }

  return selectors;
}
