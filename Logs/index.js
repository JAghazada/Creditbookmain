const sqlite3 = require("sqlite3");
const {openDb, closeDb} = require("../Helpers/ORM/index")
function adding_log(id,name,surname,date){
    const db = openDb();
    const log = name +" " + surname +`  ${date} tarixinde elave edildi`
    db.all(`INSERT INTO logs (id,name,surname,log,date,operation) 
    VALUES(${id},"${name}","${surname}","${log}","${date}","adding")`)
    closeDb(db)
    
}
function payment_log (id,name,surname,date,amount,operation){
    // [-]12(2022-02-02)]
    const db = openDb()
    let log;
    let symbol;
    if(operation==="+"){
        symbol="+"
        log=`[+]${amount} (${date})`    
    }else{
        log = `[-]${amount} (${date})`
        symbol="-"
    }
   
    db.all(`INSERT INTO logs (id,name,surname,log,date,operation) 
    VALUES(${id},"${name}","${surname}","${log}","${date}",'${symbol}')`)
    // [+8](2022-02-02)
    closeDb(db)

}
// edit
function edit_log(oData,nData,date){
    const db = openDb()
    const {id,name,surname,credit,phone,specialInfo,dateAdded,goods,startingDate} = oData;
    const log=`
        <span style='color:#000'>(${date})</span> <br>
        Ad:${name}=>${nData.name===undefined?" ":nData.name}<br> 
        Soyad:${surname}=>${nData.surname===undefined?" ":nData.surname}<br> 
        Ilkin Borc:${credit}=>${nData.credit===undefined?" ":nData.credit}<br> 
        Borc:${credit}=>${nData.credit===undefined?" ":nData.credit}<br> 
        Telefon:${phone}=>${nData.phone===undefined?" ":nData.phone}<br> 
        XususiQeyd:${specialInfo}=>${nData.specialInfo===undefined?" ":nData.specialInfo}<br> 
        ElaveOlunamTarixi:${dateAdded}=>${nData.dateAdded===undefined?" ":nData.dateAdded}<br> 
        BorcBaslangicTarixi:${startingDate}=>${nData.startingDate===undefined?" ":nData.startingDate}<br> 
        Mallar:${goods}=>${nData.goods===undefined?" ":nData.goods}<br> 
        seklinde (${date}) tarixinde deyisdirildi.
        <hr>
        `
    db.all(`INSERT INTO logs (id,name,surname,log,date,operation) 
    VALUES(${id},"${nData.name}","${nData.surname}","${log}","${date}",'Edit')`)
    closeDb(db)
}
// 
function recall_log(id,name,surname,date){
    const db = openDb();
    const log =`${name} ${surname} ${date} tarixinde geri qaytarildi!`
    db.all(`INSERT INTO logs (id,name,surname,log,date,operation) 
    VALUES(${id},"${name}","${surname}","${log}","${date}",'Delete')`)
    closeDb(db)
}
// delete
function delete_log(id,name,surname,date){
    const db = openDb();
    const log =`${name} ${surname} ${date} tarixinde silindi!`
    db.all(`INSERT INTO logs (id,name,surname,log,date,operation) 
    VALUES(${id},"${name}","${surname}","${log}","${date}",'Delete')`)
    closeDb(db)

}
module.exports = {
    adding_log,
    payment_log,
    edit_log,
    delete_log,
    recall_log
}