export function chunkHtml(html, chunkSize = 20000) {
    const chunks = [];
    for (let i = 0; i < html.length; i += chunkSize) {
      chunks.push(html.slice(i, i + chunkSize));
    }
    return chunks;
  }
  
  export function filterChunksWithReviews(chunks) {
    return chunks.filter((chunk) => chunk.toLowerCase().includes('rating'));
  }
  