import { Component } from "react";
const list = [1,2,3,4,5,6,7]
export default class FilterDropdonw extends Component {
    constructor(props){
        super(props)
        this.state = {
            active: false,
        }
    }
    renderItem(){
        if (this.state.active)
        return(
            this.props.books.map(item => (
                <div onClick={() => {this.props.chooseBook(item); this.setState({active: false})}} className="p-2 ">{item.name}</div>
            ))
        )
    }
    render(){
        return(
            <div className="dropdown">
                <div className="d-flex flex-row">
                    <input 
                    className="input-group-text"
                    placeholder="search book" onFocus={() =>this.setState({active: true})} />
                    <span className="border p-2 btn border-secondary">v</span>
                </div>
                <div>
                <div onFocus={() =>this.setState({active: true})} className="item-select rounded bg-dark-subtle text-light">
                {this.renderItem()}</div>
                </div>
            </div>
        )
    }
}