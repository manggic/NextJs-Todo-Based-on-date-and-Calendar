let months = {
  january: {
    number: "01",
    shortName: "jan",
    fullName: "January",
  },
  february: {
    number: "02",
    shortName: "feb",
    fullName: "February",
  },
  march: {
    number: "03",
    shortName: "mar",
    fullName: "March",
  },
  april: {
    number: "04",
    shortName: "apr",
    fullName: "April",
  },
  may: {
    number: "05",
    shortName: "may",
    fullName: "May",
  },
  june: {
    number: "06",
    shortName: "jun",
    fullName: "June",
  },
  july: {
    number: "07",
    shortName: "jul",
    fullName: "July",
  },
  august: {
    number: "08",
    shortName: "aug",
    fullName: "August",
  },
  september: {
    number: "09",
    shortName: "sep",
    fullName: "September",
  },
  october: {
    number: "10",
    shortName: "oct",
    fullName: "October",
  },
  november: {
    number: "11",
    shortName: "nov",
    fullName: "November",
  },
  december: {
    number: "12",
    shortName: "dec",
    fullName: "December",
  },
};

const events = {
  expenses : {
    fields: ["name", "price"],
    formfields : ["name", "price"],
    edit: true,
    delete: true,
    status: false,
    width:120,
    trimLength:20
  },
  todo : {
    fields: ["name"],
    formfields : ["name", "status"],
    edit: true,
    delete: true,
    status: true,
    width:75,
    trimLength:10
  }
}

// checks if provided value is object and has data in it
const checkIfObjectAndHasData = (data) => {
  try {
    return typeof data === "object" && Object.keys(data).length > 0
  } catch (error) {
    return false
  }
}



export { months, events, checkIfObjectAndHasData };
