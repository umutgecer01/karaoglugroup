// Decode only one layer. Replacement text is never parsed a second time.
const entities = Object.freeze({ '&amp;': '&', '&quot;': '"', '&#x27;': "'", '&lt;': '<', '&gt;': '>' });
export const decodeHtmlEntities = value => value.replace(/&(?:amp|quot|#x27|lt|gt);/g, entity => entities[entity]);
