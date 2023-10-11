// ! goods operations
const add_btn = document.getElementById("btn-add");
const delete_btn = document.getElementById("btn-delete");
const E_goods_lists = document.getElementById("goods-lists");
let isTypeDeleted;
let goods_array = [];
const renew_goods = () => {
  E_goods_lists.innerHTML = "";

  goods_array.map((goods) => {
    const _E_li = document.createElement("li");
    _E_li.innerHTML = `<span class="pr-2">${goods.name} </span>
      <img
          id="btn-delete"
          class="t-can"
          src="icons/trash-can.svg"
          alt="sil"
          onclick="deleteGoods(${goods.id})"
      />`;
    E_goods_lists.append(_E_li);
  });
};
const deleteGoods = (goods_id) => {
  goods_array = goods_array.filter((x) => (x.id !== goods_id ? x : false));
  renew_goods();
};
document.querySelector('.pdmc-btn').addEventListener('click', function () {

  
  const element = document.querySelector('body')
  html2pdf().from(element).save()


})
add_btn.addEventListener("click", () => {
  const add_goods_count = document.querySelector(".add-goods-count");
  const add_goods_name = document.querySelector(".add-goods-name");
  if (add_goods_count.value === "" || add_goods_name.value === "") {
    return false;
  }
  const goods_info = {
    id: goods_array.length,
    name: add_goods_name.value + " : " + add_goods_count.value,
  };
  goods_array.push(goods_info);
  renew_goods();
  add_goods_name.value = "";
  add_goods_count.value = "";
});

// ! other-buttons
const { ipcRenderer, ipcMain } = require("electron");
const other_buttons = document.querySelector(".other-buttons");
let activeId;
let allUsers;
const activeButtons = (id) => {
  activeId = id;
  document.querySelector(`.other-buttons-${id}`).classList.toggle("d-block");
};
document.querySelector(".gdltdusers").addEventListener("click", () => {
  ipcRenderer.send("key:deletedUsers")
})
document.querySelector(".gllusers").addEventListener("click", () => {
  ipcRenderer.send("key:allUsers")
})
const renewUsers = (data) => {
  let buttonGroup;
  let paymentGroup;
  let credit = 0;
  allUsers = data
  data.map((userdata) => {
    credit += parseFloat(userdata.credit);
  });
  document.querySelector(".creditamount").textContent = credit;
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = ``;

  for (let c of data) {
    if (isTypeDeleted !== "deleted") {
      document.querySelector('.ispayth').textContent = 'Ode'
      paymentGroup = `<button onclick="payUserCredit({
        id:'${c.id}',
        name:'${c.name}',
        surname:'${c.surname}',
        credit:'${c.credit}'
      })" class="btn btn-primary pymntbtn">Ode</button>`
      buttonGroup = ` <button class="btn mt-1 d-block w-100 btn-warning" onclick="editUser(
        { id:'${c.id}',
        name:'${c.name}',
        surname:'${c.surname}',
        credit:'${c.credit}',
        phone:'${c.phone}',
        specialInfo:'${c.specialInfo}',
        dateAdded:'${c.dateAdded}',
        startingDate:'${c.startingDate}'
      
      
      })">
      Duzelt
      </button>
      <button onclick="increaseUserCredit({
          id:'${c.id}',
          name:'${c.name}',
          surname:'${c.surname}',
          credit:'${c.credit}'
        })" class="btn d-block w-100 btn-dark">
          Borc +
        </button>
        <button onclick="deleteUser({
          id:'${c.id}',
          name:'${c.name}',
          surname:'${c.surname}'
        })" class="btn d-block w-100 btn-danger">
          Sil
        </button>
        <button onclick="getLogs({
          id:'${c.id}',
          name:'${c.name}',
          surname:'${c.surname}'
        })"" class="btn d-block w-100 btn-info">
          Qeydler
        </button>`
    } else {
      document.querySelector('.ispayth').textContent = 'Geri Qaytar'
      paymentGroup = `<button class="btn mt-1 d-block w-100 btn-danger" onclick="recallUser(
        { id:'${c.id}',
        name:'${c.name}',
        surname:'${c.surname}',
      })">Geri Qaytar</button>`
      buttonGroup = `
        <button onclick="getLogs({
          id:'${c.id}',
          name:'${c.name}',
          surname:'${c.surname}'
        })"" class="btn d-block w-100 btn-info">
          Qeydler
        </button>
        `

    }
    const tr = document.createElement("tr");
    const goods = split_goods(c.goods, 2)
    tr.innerHTML = `
        <th scope="row" onclick="getUserInfo('${c.id}')" class=${c.credit === "0" ? "no-credit" : "scope"}>${c.id
      }</th>
        <td class=${c.credit === "0" ? "no-credit" : ""}>${c.name === "" ? "------" : c.name
      }</td>
        <td  class=${c.credit === "0" ? "no-credit" : "scope-def"} >${c.credit === "" ? "------" : c.credit
      }</td>
        <td  class=${c.credit === "0" ? "no-credit" : ""}>${c.goods === "" ? "------" :
        goods === undefined ? "---" : `<pre>${goods}</pre>`
      }</td>
        <td  class=${c.credit === "0" ? "no-credit" : "scope-def"}>${c.lastPaymentAmount === "" ? "------" : c.lastPaymentAmount
      }</td>
        <td class=${c.credit === "0" ? "no-credit" : ""
      }>
        ${paymentGroup}
      
      </td>
        <td  class=${c.credit === "0" ? "no-credit selects" : "selects scope-def"
      } >
          <div onclick="activeButtons(${c.id})"
            class="btn btn-secondary selection d-flex justify-content-center align-items-center"
          >
            <span>Diger</span>
            <img src="./icons/down.svg" class="down" alt="diger" />
          </div>
          <div class="d-flex justify-content-center">
            <div class="d-none other-buttons other-buttons-${c.id}">
            ${buttonGroup}
             
            </div>
          </div>
        </td> `;

    tbody.append(tr);
  }
};
ipcRenderer.on("key:newUsers", (err, data) => {
  isTypeDeleted = "all"
  renewUsers(data);
});
ipcRenderer.on("key:passrequest",(err,data)=>{
  document.querySelector(".modalz").style.display="flex"
  document.querySelector(".pc_layout ").style.display="block"

})
// cprequest
const resetPassChangeRequestModal=()=>{
  document.querySelector(".modalz").style.display="none"
  document.querySelector(".pc_layout ").style.display="none"
  document.querySelector(".oldpassr").value=''
  document.querySelector(".newpassr").value=''
  document.querySelector(".mvqtb").style.display="none"
}
document.querySelector(".cprequest").addEventListener("click",()=>{
  const oldpass =localStorage.getItem("password")
  const oldpassr =document.querySelector(".oldpassr").value.trim()
  const newpassr =document.querySelector(".newpassr").value.trim()
  if(oldpassr===oldpass){
    localStorage.removeItem("password");
    localStorage.setItem("password",newpassr)
    password=localStorage.getItem("password")
    resetPassChangeRequestModal()
  }else{
    document.querySelector(".mvqtb").style.display="block"
    return false
  }
})
document.querySelector(".cpcancel").addEventListener("click",()=>{
 resetPassChangeRequestModal()

})
// cpcancel
// oldpassr
// newpassr
ipcRenderer.on("key:deletedUsers", (err, data) => {
  isTypeDeleted = "deleted"
  renewUsers(data)
})
ipcRenderer.on("key:wpass",()=>{
  openModal(0,"wip")
})
ipcRenderer.on("key:users", (err, dt) => {
  isTypeDeleted = "all"
  renewUsers(dt);
});
const closeModal = () => {
  document.querySelector(".modal").classList.remove("d-block");
  document.querySelector(".modal").classList.add("d-none");
  document.querySelector("._P_layout").classList.remove("d-block");
  document.querySelector("._P_layout").classList.add("d-none");
  document.querySelector("._E_layout").classList.remove("d-block");
  document.querySelector("._E_layout").classList.add("d-none");
  document.querySelector(".layout").classList.remove("d-block");
  document.querySelector(".layout").classList.add("d-none");
  document.querySelector(".layout-2").classList.remove("d-block");
  document.querySelector(".layout-2").classList.add("d-none");
  document.querySelector("._I_layout").classList.remove("d-block");
  document.querySelector("._I_layout").classList.add("d-none");
  document.querySelector("._Info_layout").classList.remove("d-block");
  document.querySelector("._Info_layout").classList.add("d-none");
  document.querySelector(".pasc").value = "";
  document.querySelector("#userpaymentamount").value = "";
  document.querySelector("#increaseamount").value = "";
};

document.querySelector(".close-getuser-info-modal").addEventListener("click", () => {
  closeModal()
})
const closeButtons = () => {
  try {
    document.querySelector(`.other-buttons-${activeId}`).classList.add("d-none");  //error is in this line.
    document
      .querySelector(`.other-buttons-${activeId}`)
      .classList.remove("d-block");
  } catch (Err) {
    return false
  }
};
// !passwords

if(localStorage.getItem("password")===null){
  localStorage.setItem("password", 9637);

}
let password = localStorage.getItem("password");
// !editUser

let ulname = ""
const getLogs = (data) => {
  ulname = data.name + " " + data.surname
  ipcRenderer.send("key:getLogs", data.id);
}
const cmf_sect = document.querySelector(".cmf-sect")

ipcRenderer.on("key:userLogs", (err, data) => {
  closeButtons()
  document.querySelector(".modal-f-w").style.display = "flex"


  if (data.length === 0) {
    document.querySelector(".cmf").textContent = `${ulname} Qeydleri:`
    return false
  }
  const { name, surname } = data[0];
  document.querySelector(".cmf").textContent = `${name} ${surname}  Qeydleri:`
  const reset = () => {

    data.map(log => {

      if (log.operation === "adding") {
        logs += (`<p class="p-log">${log.log}</p><br>`)
      }
      else if (log.operation === "Delete") {
        logs += (`<p class="p-log delete-log">${log.log}</p><br>`)

      } else if (log.operation === "Edit") {
        logs += (`<p class="p-log edit-log">${log.log}</p><br>`)
      }
      else if (log.operation === "-") {
        const val = parseInt((log.log.split('[-]')[1].split(" ")[0]))
        payed += val
        logs += (`<p class="p-log payment-log">${log.log}</p><br>`)

      } else if (log.operation === "+") {
        const val = parseInt((log.log.split('[+]')[1].split(" ")[0]))
        increased += val
        logs += (`<p class="p-log increase-log">${log.log}</p><br>`)


      }
    })
    cmf_sect.innerHTML = logs
    document.querySelector(".dcs").innerHTML = increased
    document.querySelector(".pys").innerHTML = payed
  }

  let logs = ""
  let increased = 0
  let payed = 0
  reset()

  document.querySelector("#whatnote").addEventListener("change", (e) => {
    if (e.target.value === "payment") {
      cmf_sect.innerHTML = ``
      logs = ''
      increased = 0
      payed = 0

      console.log("taqala")
      data.map(log => {
        if (log.operation === "-") {
          const val = parseInt((log.log.split('[-]')[1].split(" ")[0]))
          payed += val
          logs += (`<p class="p-log payment-log">${log.log}</p></br>`)

        } else if (log.operation === "+") {
          const val = parseInt((log.log.split('[+]')[1].split(" ")[0]))
          increased += val
          logs += (`<p class="p-log increase-log">${log.log}</p></br>`)


        }
      })
      cmf_sect.innerHTML = logs
      document.querySelector(".dcs").innerHTML = increased
      document.querySelector(".pys").innerHTML = payed
    } else {
      logs = ""
      increased = 0
      payed = 0
      reset()
    }

  })


})
document.querySelector(".clsimg>img").addEventListener("click", () => {
  document.querySelector(".modal-f-w").style.display = "none"
  cmf_sect.innerHTML = ``


})
const recallUser = (data) => {
  data.date = new Date(Date.now()).toISOString().split("T")[0],
    ipcRenderer.send("key:recallUser", data)
}
const editUser = (data) => {
  openModal(3);
  document.querySelector("#name").value = data.name;
  document.querySelector("#surname").value = data.surname;
  document.querySelector("#credit").value = data.credit;
  document.querySelector("#time").value = data.dateAdded;
  document.querySelector("#phone").value = data.phone;
  document.querySelector("#specialInfo").value = data.specialInfo;
  document.querySelector(".edit-use-btn").addEventListener("click", () => {
    let name = document.querySelector("#name").value;
    let surname = document.querySelector("#surname").value;
    let credit = document.querySelector("#credit").value;
    let date = document.querySelector("#time").value;
    let phone = document.querySelector("#phone").value;
    let specialInfo = document.querySelector("#specialInfo").value;
    let dateChanged = new Date(Date.now()).toISOString().split("T")[0];
    if (credit === "") {
      return false
    } else if (isNaN(credit)) {
      return false
    } else {
      const info = {
        oldata: data,
        dateChanged,
        id: data.id,
        name,
        surname,
        credit,
        date,
        phone,
        specialInfo,
        goods: goods_array,
      };
      ipcRenderer.send("key:editedUser", info);
      document.querySelector("#name").value = "";
      document.querySelector("#surname").value = "";
      document.querySelector("#credit").value = "";
      document.querySelector("#time").value = "";
      document.querySelector("#phone").value = "";
      document.querySelector("#specialInfo").value = "";
      closeModal();
      goods_array = []
      document.getElementById("goods-lists").innerHTML = ''

    }
  });
};
document.querySelector(".search").addEventListener("input", (e) => {
  const inp_val = document.querySelector(".search").value;
  const select = document.querySelector("#selectwhat").value;
  if (isTypeDeleted === "deleted") {
    ipcRenderer.send("key:searchUser", { type: "deleted", select, value: inp_val });

  } else {
    ipcRenderer.send("key:searchUser", { type: "all", select, value: inp_val });
  }
});

// !search
function search(e) {
}
// !increase credit
let UserIncreaseData;
const increaseUserCredit = (data) => {
  openModal(2);
  document.getElementById("usercredit").value = `${data.credit} AZN`;
  document.querySelector(
    ".nameinfo"
  ).innerText = `${data.name} ${data.surname}`;
  UserIncreaseData = data;
};
document
  .querySelector(".increase-user-credit")
  .addEventListener("click", () => {
    const increaseAmount = document
      .getElementById("increaseamount")
      .value.trim();
    if (increaseAmount === "") {
      return false;
    }
    ipcRenderer.send("key:increaseUserCredit", {
      ...UserIncreaseData,
      increaseAmount,
      date: new Date(Date.now()).toISOString().split("T")[0],
    });
    closeModal();
  });
// !pay
let userData;
const payUserCredit = (data) => {
  openModal(1);

  document.getElementById("usercredit-pay").value = `${data.credit} AZN`;
  document.querySelector(
    ".nameinfo2"
  ).innerText = `${data.name} ${data.surname}`;
  userData = data;
};
document.querySelector(".pay-user-credit").addEventListener("click", () => {
  const paymentAmount = document
    .getElementById("userpaymentamount")
    .value.trim();
  if (paymentAmount === "") {
    return false;
  }
  ipcRenderer.send("key:payUserCredit", {
    ...userData,
    paymentAmount,
    date: new Date(Date.now()).toISOString().split("T")[0],
  });
  closeModal();
});
// !buttons actions
document.querySelector(".whatispass").addEventListener("click",()=>{
  const userguess =document.querySelector(".wisp").value.trim()
  if(userguess===password){
    return closeModal()
  }
 return false
  
})
let deletedUserInfo;
const openModal = (type,wip) => {
  document.querySelector(".modal").classList.add("d-block");
  if (type === 0) {
    if(wip==="wip"){
      document.querySelector(".layout-2").classList.add("d-block");
    }
    document.querySelector(".layout").classList.add("d-block");
  } else if (type === 1) {
    document.querySelector("._P_layout").classList.add("d-block");
  } else if (type === 2) {
    document.querySelector("._I_layout").classList.add("d-block");
  } else if (type === 3) {
    document.querySelector("._E_layout").classList.add("d-block");
  } else if (type === 4) {
    document.querySelector("._Info_layout").classList.add("d-block");

  }
  activeId === undefined ? false : closeButtons();

};
const deleteUser = (data) => {
  openModal(0);
  deletedUserInfo = data;
};

document.querySelector(".ecancel-user-btn").addEventListener("click", () => {
  closeModal();
});
document.querySelector(".dcancel-user-btn").addEventListener("click", () => {
  closeModal();
});
document.querySelector(".icancel-user-btn").addEventListener("click", () => {
  closeModal();
});
document.querySelector(".cincrease-user-btn").addEventListener("click", () => {
  closeModal();
});
document.querySelector(".delete-user-btn").addEventListener("click", () => {
  const pass = document.querySelector(".pasc").value;
  if (pass == password) {
    ipcRenderer.send("key:deleteUser", { id: deletedUserInfo.id, name: deletedUserInfo.name, surname: deletedUserInfo.surname, date: new Date(Date.now()).toISOString().split("T")[0] });
    closeModal();
  }
});
// k-stuffs
function split_goods(stuff, type) {
  try {
    const k_stuff = document.querySelector(".k-stuffs")
    const splitted = stuff.split("[");
    const final_arr = splitted[splitted.length - 1].split("]")[0].split('},')
    let faq = ''
    if (final_arr.length > 1) {
      k_stuff.innerHTML = ``
      final_arr.map(x => {
        const result = (x.split(`"name":`)[1].split(`"`)[1])
        if (type === 1) {
          const div = document.createElement("div")
          div.innerHTML = `<div class="pl-2"><span class="stuff-name">${result}</span> </div>`
          k_stuff.appendChild(div)
        }
        faq += `${result}\n`


      })
      if (type === 2) {
        return faq

      }

    } else {
      k_stuff.innerHTML = ``
      const result = final_arr[0].split(`"name":`)[1].split("}")[0].split(`"`)[1]
      k_stuff.innerHTML = `<div class="pl-2"><span class="stuff-name">${result}</span> </div>`
      if (type === 2) {
        return result
      }
    }
  } catch (error) {
  }
}
const edit_info_modal = (data) => {
  document.querySelector(".k-name").innerText = data.name
  document.querySelector(".k-surname").innerText = data.surname
  document.querySelector(".k-phone").innerText = data.phone
  document.querySelector(".k-credit").innerText = data.credit
  document.querySelector(".k-initialDebt").innerText = data.initialDebt
  document.querySelector(".k-lastpaymentamount").innerText = data.lastPaymentAmount
  document.querySelector(".k-lastpaymentdate").innerText = data.lastPaymentTime
  document.querySelector(".k-note").innerText = data.specialInfo
  document.querySelector(".k-startingdate").innerText = data.startingDate
  document.querySelector(".k-addingtime").innerText = data.dateAdded
  //  document.querySelector(".k-stuffs").textContent=data.goods
  //   data22 ={
  //     "id": 25,
  //     "name": "jamil",
  //     "surname": "aghazadatest",
  //     "phone": "0557553155",
  //     "credit": "150",
  //     "lastPaymentAmount": "102832",
  //     "lastPaymentTime": "2022-10-27",
  //     "specialInfo": "",
  //     "startingDate": "",
  //     "dateAdded": "2022-10-12",
  //     "goods": "[{\"id\":0,\"name\":\"bjh\",\"count\":\"3\"}]"
  // }
  split_goods(data.goods, 1)

}
const getUserInfo = (id) => {
  allUsers.map(user => {
    if (user.id === parseInt(id)) {
      openModal(4);
      edit_info_modal(user)

    }
  })
}
