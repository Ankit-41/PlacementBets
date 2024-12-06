// utils/stakeCalculator.js
const calculateStakes = (forTokens, againstTokens) => {
    // Calculate total tokens
    const totalTokens = forTokens + againstTokens;
    
    // Find the smaller of forTokens and againstTokens
    const smallerAmount = Math.min(forTokens, againstTokens);
    
    // Calculate 10% of smaller amount
    const deduction = smallerAmount * 0.1;
    
    // Calculate decider value
    const decider = totalTokens - deduction;
    
    // Calculate stakes
    // Use Math.max to prevent division by zero, and round to 2 decimal places
    const forStake = decider > 0 ? Number(( decider/forTokens ).toFixed(2)) : 1;
    const againstStake = decider > 0 ? Number((decider/againstTokens).toFixed(2)) : 1;
    
    return {
      forStake,
      againstStake
    };
  };
  
  module.exports = calculateStakes;