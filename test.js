const goods = `[{"id":0,"name":"qazan0000 : 1"}]`
const g2 =`[{"id":0,"name":"qazan1 : 3"},{"id":2,"name":"qazan47 : 15"},{"id":2,"name":"qazan56 : 612"}]`
const g3 =`[{"id":1,"name":"d qhgdbwq : 2"},{"id":1,"name":"iqwniwqnd : 213213"},{"id":2,"name":"djwqnbdkqw : 12321321"}]`
function split_goods (stuff){
    const splitted = stuff.split("[");
    const final_arr =splitted[splitted.length-1].split("]")[0].split('},')
    if(final_arr.length>2){
        final_arr.map(x=>{
            console.log(x.split(`"name":`)[1].split(`"`)[1])
        })
       
    }else{
        r=final_arr[0].split(`"name":`)[1].split("}")[0].split(`"`)[1]
        console.log(r)
    }
}
split_goods(goods)
console.log("---------------------")
split_goods(g2)
console.log("---------------------")
split_goods(g3)
console.log("---------------------")