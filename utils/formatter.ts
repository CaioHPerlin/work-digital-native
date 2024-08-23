class Formatter {
  public static formatDate = (date: string) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  public static formatPhone = (phone: string) => {
    return phone.replace(/\D/g, "");
  };
}

export default Formatter;
