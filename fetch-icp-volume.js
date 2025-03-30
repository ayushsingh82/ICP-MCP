// Script to fetch trading volume for Internet Computer blockchain
const axios = require('axios');

// Add this at the start of the file to help debug
const DEBUG = true;

/**
 * Fetches 24h volume data for Internet Computer blockchain from DeFiLlama API
 */
async function fetchICPVolume() {
  try {
    // Fetch protocol data from DeFiLlama
    const response = await axios.get('https://api.llama.fi/overview/dexs');
    
    // Filter protocols on ICP chain - try different possible names
    const icpDexs = response.data.protocols.filter(protocol => 
      protocol.chains.some(chain => 
        ['Internet Computer', 'ICP', 'InternetComputer', 'Internet-Computer']
        .includes(chain)
      )
    );
    
    // Calculate total 24h volume
    const total24hVolume = icpDexs.reduce((sum, dex) => sum + dex.total24h, 0);
    
    console.log('ICP DEXs:', icpDexs.map(p => ({
      name: p.name,
      volume24h: `$${(p.total24h).toLocaleString()}`,
      chains: p.chains
    })));
    
    console.log(`\nTotal 24h Volume on Internet Computer: $${total24hVolume.toLocaleString()}`);
    
    return {
      total24hVolume,
      dexs: icpDexs
    };
  } catch (error) {
    console.error('Error fetching ICP volume:', error.message);
    throw error;
  }
}

// Execute the function when this script is run directly
if (require.main === module) {
  fetchICPVolume();
}

module.exports = { fetchICPVolume }; 