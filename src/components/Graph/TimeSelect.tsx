function calculateDateBefore(durationInDays: number) {
  const currentDate = new Date();
  const calculatedDate = new Date(currentDate);
  calculatedDate.setDate(currentDate.getDate() - durationInDays);

  const year = calculatedDate.getFullYear();
  const month = calculatedDate.getMonth() + 1;
  const day = calculatedDate.getDate();

  return `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;
}

const lastOpeningDate =
  new Date().getDay() === 0
    ? `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
        new Date().getDate() - 2
      }`
    : new Date().getDay() === 1
      ? `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
          new Date().getDate() - 3
        }`
      : `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
          new Date().getDate() - 1
        }`;

const timeSelector = {
  endDate: calculateDateBefore(0),
  fiveYears: calculateDateBefore(5 * 365),
  threeYears: calculateDateBefore(3 * 365),
  oneYear: calculateDateBefore(365),
  halfYear: calculateDateBefore(183),
  threeMonths: calculateDateBefore(3 * 30),
  oneMonth: calculateDateBefore(30),
  fiveDays: calculateDateBefore(5),
  lastOpeningDate: lastOpeningDate,
};
export default timeSelector;
