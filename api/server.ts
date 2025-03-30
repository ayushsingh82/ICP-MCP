import { z } from "zod";
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";
import fetchICPTVL from "../lib/fetch-icp-tvl";
import fetchICPPrices from "../lib/fetch-icp-prices";
import fetchICPVolume from "../lib/fetch-icp-volume";

const handler = initializeMcpApiHandler(
  (server) => {
    server.tool(
      "get-token-price",
      "Get the price of a token in Internet Computer network",
      { token_id: z.string() },
      async ({ token_id }) => {
        const priceData = await fetchICPPrices();
        return {
          content: [
            { 
              type: "text", 
              text: `Current ICP Price: $${priceData.price}\n24h Change: ${priceData.change24h}%` 
            },
          ],
        };
      }
    );

    server.tool(
      "get-tvl",
      "Get the total value locked of Internet Computer network",
      {},
      async () => {
        const tvlData = await fetchICPTVL();
        
        return {
          content: [
            {
              type: "text",
              text: `Current ICP TVL: $${tvlData.totalTVL.toLocaleString()}\n` +
                    `Number of Protocols: ${tvlData.protocols.length}\n` +
                    `Protocols: ${tvlData.protocols.map(p => 
                      `\n- ${p.name}: $${p.tvl.toLocaleString()}`
                    ).join('')}`,
            },
          ],
        };
      }
    );

    server.tool(
      "get-volume",
      "Get the trading volume on Internet Computer",
      {},
      async () => {
        const volumeData = await fetchICPVolume();
        
        return {
          content: [
            {
              type: "text",
              text: `24h Trading Volume: $${volumeData.total24hVolume.toLocaleString()}\n` +
                    `DEXs: ${volumeData.dexs.map(d => 
                      `\n- ${d.name}: $${d.volume24h.toLocaleString()}`
                    ).join('')}`,
            },
          ],
        };
      }
    );

    server.tool(
      "get-market-overview",
      "Get comprehensive market overview for Internet Computer",
      {},
      async () => {
        const [priceData, tvlData, volumeData] = await Promise.all([
          fetchICPPrices(),
          fetchICPTVL(),
          fetchICPVolume()
        ]);

        return {
          content: [
            {
              type: "text",
              text: 
                `Internet Computer Market Overview\n` +
                `----------------------------\n` +
                `Price: $${priceData.price}\n` +
                `24h Change: ${priceData.change24h}%\n` +
                `24h Volume: $${volumeData.total24hVolume.toLocaleString()}\n` +
                `Total TVL: $${tvlData.totalTVL.toLocaleString()}\n` +
                `Active Protocols: ${tvlData.protocols.length}`,
            },
          ],
        };
      }
    );
  },
  {
    capabilities: {
      tools: {
        "get-token-price": {
          description: "Get the current price of ICP token",
          parameters: {
            token_id: { type: "string" },
          },
        },
        "get-tvl": {
          description: "Get the total value locked in Internet Computer protocols",
          parameters: {},
        },
        "get-volume": {
          description: "Get the trading volume on Internet Computer DEXs",
          parameters: {},
        },
        "get-market-overview": {
          description: "Get comprehensive market overview for Internet Computer",
          parameters: {},
        },
      },
    },
  }
);

export default handler;
