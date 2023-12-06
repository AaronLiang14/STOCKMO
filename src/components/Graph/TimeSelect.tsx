const fiveYears = `${new Date().getFullYear() - 5}-${
  new Date().getMonth() + 1
}-${new Date().getDate()}`;

const threeYears = `${new Date().getFullYear() - 3}-${
  new Date().getMonth() + 1
}-${new Date().getDate()}`;

const oneYear = `${new Date().getFullYear() - 1}-${
  new Date().getMonth() + 1
}-${new Date().getDate()}`;

const endDate = `${new Date().getFullYear()}-${
  new Date().getMonth() + 1
}-${new Date().getDate()}`;

const halfYear = `${new Date().getFullYear()}-${
  new Date().getMonth() - 6
}-${new Date().getDate()}`;

const threeMonths = `${new Date().getFullYear()}-${
  new Date().getMonth() - 3
}-${new Date().getDate()}`;

const oneMonth = `${new Date().getFullYear()}-${
  new Date().getMonth() - 1
}-${new Date().getDate()}`;

const fiveDays = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
  new Date().getDate() - 7
}`;

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
  endDate: endDate,
  fiveYears: fiveYears,
  threeYears: threeYears,
  oneYear: oneYear,
  halfYear: halfYear,
  threeMonths: threeMonths,
  oneMonth: oneMonth,
  fiveDays: fiveDays,
  lastOpeningDate: lastOpeningDate,
};

export default timeSelector;
