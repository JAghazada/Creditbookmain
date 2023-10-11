class Customer {
  constructor(
    name,
    surname,
    phone,
    debt,
    startingTime,
    lastPaymentTime,
    note,
    goods,
    lastPaidAmount
  ) {
    this.name = name;
    this.surname = surname;
    this.phone = phone;
    this.debt = debt;
    this.startingTime = startingTime;
    this.lastPaymentTime = lastPaymentTime;
    this.note = note;
    this.goods = goods;
    this.lastPaidAmount = lastPaidAmount;
  }
}
module.exports = Customer;
