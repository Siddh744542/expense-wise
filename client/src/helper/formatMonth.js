const formatMonth = (monthString) => {
  const date = new Date(`${monthString}-01`);
  const monthName = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${monthName} - ${year}`;
};

export default formatMonth;
