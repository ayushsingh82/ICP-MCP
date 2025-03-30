// Script to fetch Total Value Locked (TVL) for Internet Computer blockchain
const axios = require('axios');

/**
 * Fetches TVL data for Internet Computer blockchain from DeFiLlama API
 */
async function fetchICPTVL() {
  try {
    // Fetch protocol data from DeFiLlama
    const response = await axios.get('https://api.llama.fi/protocols');
    
    // First let's check all available chains for debugging
    const allChains = new Set();
    response.data.forEach(protocol => {
      protocol.chains.forEach(chain => allChains.add(chain));
    });
    console.log('Available chains:', Array.from(allChains).sort());
    
    // Filter protocols on ICP chain - try different possible names
    const icpProtocols = response.data.filter(protocol => 
      protocol.chains.some(chain => 
        ['Internet Computer', 'ICP', 'InternetComputer', 'Internet-Computer']
        .includes(chain)
      )
    );
    
    // Calculate total TVL for ICP
    const totalTVL = icpProtocols.reduce((sum, protocol) => sum + protocol.tvl, 0);
    
    console.log('ICP Protocols:', icpProtocols.map(p => ({
      name: p.name,
      tvl: `$${(p.tvl).toLocaleString()}`,
      chains: p.chains
    })));
    
    console.log(`\nTotal TVL on Internet Computer: $${totalTVL.toLocaleString()}`);
    
    return {
      totalTVL,
      protocols: icpProtocols
    };
  } catch (error) {
    console.error('Error fetching ICP TVL:', error.message);
    throw error;
  }
}

// Execute the function when this script is run directly
if (require.main === module) {
  fetchICPTVL();
}

module.exports = { fetchICPTVL }; 