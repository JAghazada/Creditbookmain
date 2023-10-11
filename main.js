const electron = require("electron");
const url = require("url");
const path = require("path");
const { Menu, ipcMain } = require("electron");
const { W_addUser } = require("./Helpers/Windows/addUser");
const {
  insertUser,
  openDb,
  closeDb,
  deleteUser,
  payUserCredit,
  increaseUserCredit,
  editUser,
  get_deleted_users,
  recallUser
} = require("./Helpers/ORM");
const { adding_log, payment_log, edit_log, delete_log, recall_log } = require("./Logs");
const { app, BrowserWindow } = electron;
let mainWindow;
let userArr = [];
let db = openDb();
db.each(`SELECT * FROM USERS ORDER BY id DESC`, (err, data) => {
  userArr.push(data);
});
closeDb(db);

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
app.on("ready", () => {
  const getUsers = () => {
    let newUserArr = [];
    let db = openDb();
    db.each(`SELECT * FROM USERS ORDER BY id DESC`, (err, data) => {
      newUserArr.push(data);
    });
    closeDb(db);
    return newUserArr;
  };

  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "./views/main.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
  mainWindow.webContents.on("did-finish-load", function () {
    mainWindow.webContents.send("key:wpass")
    mainWindow.webContents.send("key:users", userArr);
    userArr = [];
  });

  ipcMain.on("key:searchUser", (err, data) => {
    let prop = "name";
    let table;
    if(data.type==="deleted"){
      table="deleted_users"
    }else{
      table="USERS"
    }
    if (data.select === "surname") {
      prop = "surname";
    } else if (data.select === "credit") {
      prop = "credit";
    } else if (data.select === "phone") {
      prop = "phone";
    } else if (data.select === "lastPaymentAmount") {
      prop = "lastPaymentAmount";
    }
    let db = openDb();
    const log = `SELECT * FROM ${table} where ${prop} LIKE '%${data.value}%'`
    setTimeout(() => {
      let newUserArr = [];

      let db = openDb();
      db.each(log,
        (err, data) => {
          newUserArr.push(data);
        }
      );
      closeDb(db);
      setTimeout(() => {
        mainWindow.webContents.send("key:newUsers", newUserArr);
      }, 600);
    }, 500);
  });
  // !edit
  ipcMain.on("key:editedUser", (err, data) => {
    editUser(data);
    edit_log(data.oldata,data,data.dateChanged)
    setTimeout(() => {
      let newUserArr = [];

      let db = openDb();
      db.each(`SELECT * FROM USERS ORDER BY id DESC`, (err, data) => {
        newUserArr.push(data);
      });
      closeDb(db);
      setTimeout(() => {
        mainWindow.webContents.send("key:newUsers", newUserArr);
      }, 600);
    }, 500);
  });
  ipcMain.on("key:recallUser",(err,data)=>{
    const {id,name,surname,date} =data
    recallUser(id)
    recall_log(id,name,surname,date)
    setTimeout(() => {
      let newUserArr = [];

      let db = openDb();
      db.each(`SELECT * FROM USERS ORDER BY id DESC`, (err, data) => {
        newUserArr.push(data);
      });
      closeDb(db);
      setTimeout(() => {
        mainWindow.webContents.send("key:newUsers", newUserArr);
      }, 600);
      
     
    }, 500);
  })
  // !add
    const getID =(data)=>{
      const {name,
        surname,
        credit,
        date,
        phone,
        specialInfo,
        lastpayment,
        lastpaymentTime,
        addedTime,
        goods,} = data;
      const db = openDb();
      db.each(
        `SELECT * from USERS WHERE (name,surname,phone,credit,lastPaymentAmount,
          lastPaymentTime,specialInfo,startingDate,dateAdded,goods)
         = (
          '${name}',
          '${surname}',
          '${phone}',
          '${credit}',
          '${lastpayment}',
          '${lastpaymentTime}',
          '${specialInfo}',
          '${date}',
          '${addedTime}',
          '${JSON.stringify(goods)}')`
      ,(err,data)=>{
        adding_log(data.id,data.name,data.surname,data.dateAdded)
      });

    };
    ipcMain.on("key:addUser", async (err, data) => {
    const userInfo = ({
      name,
      surname,
      credit,
      date,
      phone,
      specialInfo,
      lastpayment,
      lastpaymentTime,
      addedTime,
      goods,
    } = data);
    
    insertUser(userInfo);
    setTimeout(() => {
      let newUserArr = [];

      let db = openDb();
      db.each(`SELECT * FROM USERS ORDER BY id DESC`, (err, data) => {
        newUserArr.push(data);
      });
      closeDb(db);
      setTimeout(() => {
        mainWindow.webContents.send("key:newUsers", newUserArr);
      }, 600);
      const id_log =getID(userInfo)
      
     
    }, 500);
  });
  function getLogs(id){
    let db = openDb()
    let logArr =[]
    console.log(`SELECT * FROM logs WHERE id=${id}`)
    db.each(`SELECT * FROM logs WHERE id=${id}`,(err,data)=>{
      logArr.push(data)
    })
    setTimeout(() => {
      mainWindow.webContents.send("key:userLogs",logArr)
    }, 500);
  }
  ipcMain.on("key:getLogs",(err,id)=>{
    getLogs(id)
  })
  ipcMain.on("key:deleteUser", (err, data) => {
    deleteUser(data.id);
    delete_log(data.id,data.name,data.surname,data.date)
    setTimeout(() => {
      let newUserArr = [];

      let db = openDb();
      db.each(`SELECT * FROM USERS ORDER BY id DESC`, (err, data) => {
        newUserArr.push(data);
      });
      closeDb(db);
      setTimeout(() => {
        mainWindow.webContents.send("key:newUsers", newUserArr);
      }, 600);
    }, 500);
  });

  // !payUserCredit
  ipcMain.on("key:payUserCredit", (err, data) => {
    const { id, credit, name,surname,paymentAmount, date } = data;
    payment_log(id,name,surname,date,paymentAmount,"-")
    payUserCredit(
      parseFloat(credit).toFixed(2),
      parseFloat(paymentAmount).toFixed(2),
      id,
      date
    );
    setTimeout(() => {
      let newUserArr = [];

      let db = openDb();
      db.each(`SELECT * FROM USERS ORDER BY id DESC`, (err, data) => {
        newUserArr.push(data);
      });
      closeDb(db);
      setTimeout(() => {
        mainWindow.webContents.send("key:newUsers", newUserArr);
      }, 600);
    }, 500);
  });
  // !increase
  ipcMain.on("key:deletedUsers",(err,data)=>{
    const db =openDb() 
    let newUserArr = [];

    db.each(`SELECT * FROM deleted_users`,(err,data)=>{
      newUserArr.push(data);
    })
    setTimeout(() => {
      mainWindow.webContents.send("key:deletedUsers", newUserArr);
      closeDb(db)
    }, 600);
   })
   ipcMain.on("key:allUsers",(err,data)=>{
    const db =openDb() 
    let newUserArr = [];

    db.each(`SELECT * FROM USERS`,(err,data)=>{
      newUserArr.push(data);
    })
    setTimeout(() => {
      mainWindow.webContents.send("key:users", newUserArr);
      closeDb(db)
    }, 600);
  })
  ipcMain.on("key:increaseUserCredit", (err, data) => {
    const { id, credit, name,surname,increaseAmount, date } = data;
    const lastCredit = parseFloat(credit) + parseFloat(increaseAmount);
    increaseUserCredit(lastCredit.toFixed(2), 0 - increaseAmount, id);
    payment_log(id,name,surname,date,increaseAmount,"+")
    setTimeout(() => {
      let newUserArr = [];

      let db = openDb();
      db.each(`SELECT * FROM USERS ORDER BY id DESC`, (err, data) => {
        newUserArr.push(data);
      });
      closeDb(db);
      setTimeout(() => {
        mainWindow.webContents.send("key:newUsers", newUserArr);
      }, 600);
    }, 500);
  });
});
const mainMenuTemplate = [
  {
    label: "Şifrə",
    submenu: [
      {
        label: "Şifrə Dəyiştir",
        accelerator: "Ctrl+P",
        click(){
          mainWindow.webContents.send("key:passrequest",({msg:"change"}))

        }
      },
    ],
  },
  {
    label: "Əlavə et",
    accelerator: "Ctrl+D",
    click() {
      W_addUser(800, 800);
    },
  },
  {
    label: "Çıxış",
    click() {
      // app.relaunch();
      app.exit();
    },
  },
  {
    label: "Developer Tools",
    accelerator: process.platform === "darwin" ? "Command + X" : "Ctrl + X",
    click(item, focusedWindow) {
      focusedWindow.toggleDevTools();
    },
  },
];
