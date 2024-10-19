const getLimitGradient = (amountSpent, limit) => {
  const percentage = (amountSpent / limit) * 100;

  if (percentage <= 50) {
    // Green to yellow for the first 50%
    return `bg-gradient-to-r from-green-400 to-yellow-400`;
  } else if (percentage <= 90) {
    // Yellow to orange between 50% and 90%
    return `bg-gradient-to-r from-yellow-400 to-orange-500`;
  } else {
    // Red for 90% and above
    return `bg-gradient-to-r from-red-500 to-red-700`;
  }
};

export default getLimitGradient;
