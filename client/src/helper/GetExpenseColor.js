export function getExpenseColor(expense, limit) {
  const percentage = (expense / limit) * 100;

  if (percentage <= 10) {
    return "bg-progress-100"; // 0-10% of limit used
  } else if (percentage <= 20) {
    return "bg-progress-200"; // 10-20% of limit used
  } else if (percentage <= 35) {
    return "bg-progress-300"; // 20-35% of limit used
  } else if (percentage <= 50) {
    return "bg-progress-400"; // 35-50% of limit used
  } else if (percentage <= 65) {
    return "bg-progress-500"; // 50-65% of limit used
  } else if (percentage <= 80) {
    return "bg-progress-600"; // 65-80% of limit used
  } else if (percentage <= 90) {
    return "bg-progress-700"; // 80-90% of limit used
  } else if (percentage <= 100) {
    return "bg-progress-800"; // 90-100% of limit used
  } else {
    return "bg-progress-900"; // Over limit
  }
}
