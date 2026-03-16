import { useEffect } from 'react';

/**
 * Google AdSense Component
 *
 * Publisher ID is loaded from environment variable VITE_ADSENSE_PUBLISHER_ID
 * NOTE: Replace the data-ad-slot values with your actual ad slot IDs from AdSense dashboard
 */

const AdSense = ({
  adSlot = '0000000000',  // Replace with your actual ad slot ID
  adFormat = 'auto',
  fullWidthResponsive = true,
  style = {},
  className = ''
}) => {
  const publisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID;
  useEffect(() => {
    // Push ad to AdSense queue when component mounts
    try {
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  // Don't render ads in development
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: 'block', ...style }}
      data-ad-client={publisherId}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive.toString()}
    />
  );
};

export default AdSense;
