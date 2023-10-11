const sqlite3 = require("sqlite3");
// !createTable

// !openDb
const openDb = () => {
  const db = new sqlite3.Database("./CreditBank", (err) => {
    if (err) {
      return err;
    }
  });
  return db;
};
// !closeDb
function closeDb(db) {
  return db.close((err) => {
    if (err) {
      return err;
    }
  });
}
// !deleteDb
function deleteTable(table_name) {
  let db = openDb();
  db.get(`DROP TABLE ${table_name}`);
  closeDb(db);
}
const get_deleted_users=()=>{
  const db =openDb() 
  db.all(`SELECT * FROM deleted_users`,(err,data)=>{
    console.log(data)
  })
}
const recallUser=(id)=>{
const db = openDb();
db.each(`SELECT * FROM deleted_users WHERE id=${id}`,(err,data)=>{
  db.each(`INSERT INTO USERS (id,name,surname,phone,credit,lastPaymentAmount,
    lastPaymentTime,specialInfo,startingDate,dateAdded,goods)
   VALUES (
    '${data.id}',
    '${data.name}',
    '${data.surname}',
    '${data.phone}',
    '${data.credit}',
    '${data.lastPaymentAmount}',
    '${data.lastpaymentTime}',
    '${data.specialInfo}',
    '${data.startingDate}',
    '${data.dateAdded}',
    '${data.goods}')`)
})
setTimeout(() => {
  db.each(`DELETE FROM deleted_users WHERE id=${id}`);
}, 500);
}
function createTable(table_name, values) {
  let db = openDb();
  db.get(`CREATE TABLE IF NOT EXISTS USERS (

    id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT ,surname TEXT ,phone TEXT ,credit TEXT ,lastPaymentAmount TEXT ,
      lastPaymentTime TEXT ,specialInfo TEXT ,startingDate TEXT ,dateAdded TEXT ,goods TEXT
    )`);
}
function insertUser(info) {
  var db = openDb();
  const {
    name,
    surname,
    phone,
    credit,
    lastpayment,
    lastpaymentTime,
    specialInfo,
    date,
    addedTime,
    goods,
  } = info;

  db.all(
    `INSERT INTO USERS (name,surname,phone,credit,initialDebt,lastPaymentAmount,
      lastPaymentTime,specialInfo,startingDate,dateAdded,goods)
     VALUES (
      '${name}',
      '${surname}',
      '${phone}',
      '${credit}',
      '${credit}',
      '${lastpayment}',
      '${lastpaymentTime}',
      '${specialInfo}',
      '${date}',
      '${addedTime}',
      '${JSON.stringify(goods)}')`
  );
}
const deleteUser = (id) => {
  let db = openDb();
  db.each(`SELECT * FROM USERS WHERE id=${id}`,(err,data)=>{
    db.all(`INSERT INTO deleted_users (id,name,surname,phone,credit,initialDebt,lastPaymentAmount,
      lastPaymentTime,specialInfo,startingDate,dateAdded,goods)
     VALUES (
      '${data.id}',
      '${data.name}',
      '${data.surname}',
      '${data.phone}',
      '${data.credit}',
      '${data.initialDebt}',
      '${data.lastPaymentAmount}',
      '${data.lastPaymentTime}',
      '${data.specialInfo}',
      '${data.startingDate}',
      '${data.dateAdded}',
      '${data.goods}')`,(err,data)=>{
          db.all(`DELETE FROM USERS WHERE id=${id}`,(err,data)=>{
          

          });
            
      })
     

  })

};
function payUserCredit(credit, paymentAmount, id, lastPaymentTime) {
  let db = openDb();
  db.each(
    `UPDATE USERS SET credit='${
      credit - paymentAmount
    }',lastPaymentAmount='${paymentAmount}',lastpaymentTime='${lastPaymentTime}' WHERE id=${id}`
  );
}

function increaseUserCredit(lastCredit, paymentAmount, id) {
  let db = openDb();
  db.each(
    `UPDATE USERS SET credit='${lastCredit}',lastPaymentAmount='${paymentAmount}' WHERE id=${id}`
  );
}
const editUser = (data) => {
  let db = openDb();
  db.each(
    `UPDATE USERS SET credit='${data.credit}',initialDebt='${data.credit}',name='${data.name}',surname='${
      data.surname
    }',dateAdded='${data.date}',
    phone='${data.phone}',specialInfo='${
      data.specialInfo
    }',goods= '${JSON.stringify(data.goods)}' WHERE id=${data.id}`
  );
};
module.exports = {
  openDb,
  closeDb,
  createTable,
  deleteUser,
  insertUser,
  payUserCredit,
  increaseUserCredit,
  editUser,
  get_deleted_users,
  recallUser
};
