import { ProductListing } from '../types';

export const validateProductListing = (listing: ProductListing): boolean => {
  const hasImage = listing.image !== null && listing.image.trim() !== '';
  const hasName = listing.name.trim() !== '';
  const hasPrice = listing.price.trim() !== '';
  
  return hasImage && hasName && hasPrice;
};
