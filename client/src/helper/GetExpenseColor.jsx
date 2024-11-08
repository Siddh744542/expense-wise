function getExpenseColor(expense, limit) {
  const percentage = (expense / limit) * 100;

  if (percentage <= 10) {
    return "bg-green-500"; // 0-10% of limit used
  } else if (percentage <= 20) {
    return "bg-green-400"; // 10-20% of limit used
  } else if (percentage <= 35) {
    return "bg-yellow-400"; // 20-35% of limit used
  } else if (percentage <= 50) {
    return "bg-yellow-500"; // 35-50% of limit used
  } else if (percentage <= 65) {
    return "bg-orange-400"; // 50-65% of limit used
  } else if (percentage <= 80) {
    return "bg-orange-500"; // 65-80% of limit used
  } else if (percentage <= 90) {
    return "bg-red-400"; // 80-90% of limit used
  } else if (percentage <= 100) {
    return "bg-red-500"; // 90-100% of limit used
  } else {
    return "bg-red-700"; // Over limit
  }
}
export default getExpenseColor;
