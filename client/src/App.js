import './App.css';
import {Component} from 'react'
import axios from 'axios'
import FilterDropdonw from './components/FilterDropdown';
import getdate from './help'
const options = [
  'one', 'two', 'three'
];
const defaultOption = options[0];
class App extends Component{
  constructor(){
    super()
    this.state = {
      books: null,
      trackers: null,
      currentbook: null,
      currenttracker: null,
      todayread: null,
      progress: null,
      currentprogress: null
    }
  }
  refresh = () => {

    axios.get('http://localhost:9000/tracker/data')
    .then(res => {
      console.log('refresh')
      // console.log(this.state.currenttracker)
      let curtrack = res.data[1].filter(item => item.id === this.state.currentbook.id && item.readdate == getdate())
      console.log(curtrack)
      if (curtrack.length)
      {
        this.setState({currenttracker: curtrack[0]})
      }
      else{
        this.createTracker(this.state.currentbook.id)
      }
      this.setState({
        progress: res.data[3],
        currentprogress: res.data[3][this.state.currentbook.id - 1],
        todayread: res.data[2][0].todayread,
        books: res.data[0],
        trackers: res.data[1],
      })
    })
    }
  chooseBook = (book) => {
    let progress = this.state.progress
    let curtrack = this.state.trackers.filter(item => item.id === book.id && item.readdate == getdate())
    this.setState({currentbook:book, currenttracker: curtrack[0], currentprogress: progress[book.id-1]})
    
  }
  notreread(){
    console.log('not re read')
    let curtrack = this.state.currenttracker
    axios.put('http://localhost:9000/tracker/notreread', {id: curtrack.id, readdate:curtrack.readdate})
    this.refresh()
  }
  reread(){
    console.log('reread')
    let curtrack = this.state.currenttracker
    axios.put('http://localhost:9000/tracker/reread', {id: curtrack.id, readdate:curtrack.readdate})
    this.refresh()
  }
  createTracker = (id) => {
    console.log('createTracker called')
    axios.post('http://localhost:9000/tracker/createTracker',{id: id})
    this.setState({currenttracker: {id: 1, readdate: getdate(), pageread: 0, progress: 0}})
    this.refresh()
  }
  componentDidMount = () => {
    axios.get('http://localhost:9000/tracker/data')
          .then(res => {

            console.log(res.data)
            let curtrack = res.data[1].filter(item => item.id == 1 && item.readdate == getdate()) 
            if (curtrack.length)
            {
              this.setState({currenttracker: curtrack[0]})
            }
            else{
              this.createTracker(1)
            }
            this.setState({
              progress: res.data[3],
              currentprogress: res.data[3][0],
              todayread: res.data[2][0].todayread,
              books: res.data[0],
              trackers: res.data[1],
              currentbook: res.data[0][0]
            })
          })
  }
  render(){
    return(
      <div className='App'>
        <div>
          <FilterDropdonw chooseBook={this.chooseBook} books={this.state.books}></FilterDropdonw>
        </div>
        <div className="title p-3 text-primary-emphasis bg-primary-subtle text-center border border-primary-subtle rounded-3">
          {this.state.currentbook?.name}
        </div>
        <div className='d-flex flex-row read justify-content-evenly align-items-center'>
          <div className="d-flex flex-column align-items-center ">
            <div>
              <button onClick={this.notreread.bind(this)} className="btn btn-primary m-3">Read</button>
            </div>
            <div>
              <button onClick={this.reread.bind(this)} className="btn btn-success">Re-read</button>
            </div>
          </div>
          <div >
            <div>
                Today you've read (this book)
            </div>
            <div>
            <span style={{fontSize:"30px"}}>{this.state.currenttracker?.pageread}</span> pages
            </div>
          </div>
          <div >
            <div>
                Today you've read
            </div>
            <div>
            <span style={{fontSize:"30px"}}>{this.state.todayread}</span> pages
            </div>
          </div>
          <div >
            <div>
                Progress
            </div>
            <div>
            <span style={{fontSize:"30px"}}>{this.state.currentbook? 
            (this.state.currentprogress?.progress + '/' + this.state.currentbook.numofp + 
            ` (${Math.round((this.state.currentprogress.progress / this.state.currentbook.numofp)*100 )}%)`)
             : "  "}</span> 
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default App;
