// Script to fetch ICP token prices
const axios = require('axios');

/**
 * Fetches price data for ICP tokens from CoinGecko API
 */
async function fetchICPPrices() {
  try {
    // Fetch ICP price data from CoinGecko
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'internet-computer',  // CoinGecko ID for ICP
        vs_currencies: 'usd',
        include_24hr_change: true,
        include_24hr_vol: true,
        include_market_cap: true
      }
    });

    const icpData = response.data['internet-computer'];
    
    console.log('ICP Price Data:', {
      price: `$${icpData.usd.toLocaleString()}`,
      change24h: `${icpData.usd_24h_change.toFixed(2)}%`,
      volume24h: `$${icpData.usd_24h_vol.toLocaleString()}`,
      marketCap: `$${icpData.usd_market_cap.toLocaleString()}`
    });
    
    return {
      price: icpData.usd,
      change24h: icpData.usd_24h_change,
      volume24h: icpData.usd_24h_vol,
      marketCap: icpData.usd_market_cap
    };
  } catch (error) {
    console.error('Error fetching ICP prices:', error.message);
    throw error;
  }
}

// Execute the function when this script is run directly
if (require.main === module) {
  fetchICPPrices();
}

module.exports = { fetchICPPrices }; 