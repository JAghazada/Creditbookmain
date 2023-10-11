const { ipcRenderer } = require("electron");
// ! goods operations
const add_btn = document.getElementById("btn-add");
const delete_btn = document.getElementById("btn-delete");
const E_goods_lists = document.getElementById("goods-lists");

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
// ! add user
document.querySelector(".add-credit").addEventListener("click", () => {
  let name = document.querySelector("#name").value;
  let surname = document.querySelector("#surname").value;
  let credit = document.querySelector("#credit").value;
  let date = document.querySelector("#time").value;
  let phone = document.querySelector("#phone").value;
  let lastpayment = document.querySelector("#lastpayment").value;
  let lastpaymentTime = document.querySelector("#lastpaymentdate").value;
  let addedTime = new Date(Date.now()).toISOString().split("T")[0];
  let specialInfo = document.querySelector("#specialInfo").value;
  const ersc = document.querySelector(".ersc");
  const createMessage = (type, msg) => {
    ersc.style.display = "block";
    if (type === "err") {
      ersc.classList.add("alert-danger");
      ersc.classList.remove("alert-success");
    } else {
      ersc.classList.remove("alert-danger");
      ersc.classList.add("alert-success");
    }
    ersc.innerText = msg;
  };

  if (credit === "") {
    createMessage("err", "Borc Qismi Boş Ola Bilməz!");
  } else if (isNaN(credit)) {
    createMessage("err", "Borc Qisminə,Sadəcə Rəqəm Daxil Edin!");
  } else {
    createMessage("success", "Uğurlu!");
    const info = {
      name,
      surname,
      credit,
      date,
      phone,
      specialInfo,
      lastpayment,
      lastpaymentTime,
      addedTime,
      goods: goods_array,
    };
    ipcRenderer.send("key:addUser", info);
    document.querySelector("#name").value = "";
    document.querySelector("#surname").value = "";
    document.querySelector("#credit").value = "";
    document.querySelector("#time").value = "";
    document.querySelector("#phone").value = "";
    document.querySelector("#lastpayment").value = "";
    document.querySelector("#lastpaymentdate").value = "";
    document.querySelector("#specialInfo").value = "";
    E_goods_lists.innerHTML=''

  }
});
