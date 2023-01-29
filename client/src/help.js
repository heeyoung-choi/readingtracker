let getdate = () => {
    let cur = new Date()
    return `${cur.getFullYear()}-${add0(cur.getMonth() + 1)}-${add0(cur.getDate())}`
}
let add0 = (item) => item >= 10 ? item.toString() : '0' + item.toString()
export default getdate;
