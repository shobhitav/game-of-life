import React,{Component}  from 'react';
import './index.css'; 
import {ButtonToolbar,Dropdown,DropdownButton} from 'react-bootstrap';

// Box
class Box extends Component{
 selectBox = () => {
   this.props.selectBox(this.props.row, this.props.col);
 }

  render(){
   return(
    <div 
    className={this.props.boxClass}
    id={this.props.id}
    onClick={this.selectBox}
      />
    );
  }
}


// Grid
class Grid extends Component{
 render(){
    const width=(this.props.cols*14)+1;
    var rowsArr=[];
    var boxClass="";
    for (var i=0;i<this.props.rows;i++){
      for (var j=0;j<this.props.cols;j++) {
        let boxId=i + "_" + j;
        
        // checking each grid ,true means on , false means off .
        boxClass=this.props.gridFull[i][j]? "box on":"box off";
        rowsArr.push(
        <Box
        boxClass={boxClass}
        key={boxId}
        boxId={boxId}
        row={i}
        col={j}
        selectBox={this.props.selectBox}
        />
        );
      
      }

    }

      return(
        <div className="grid" style={{width:width}}>
          {rowsArr}
        </div>
      );
  }

}

// Buttons Component
class Buttons extends React.Component {
  handleSelect = (event) => {
    this.props.gridSize(event);
  }

  render(){
    return (
       <div className="center">
          <ButtonToolbar>
            <button style={{margin:'5px'}} className ="btn btn-primary" onClick={this.props.seed}>Seed</button>
            <button style={{margin:'5px'}} className ="btn btn-primary" onClick={this.props.clear}>Clear</button>
            <button style={{margin:'5px'}} className ="btn btn-primary" onClick={this.props.playButton}>Play</button>
            <button style={{margin:'5px'}} className ="btn btn-primary" onClick={this.props.pauseButton}>Pause</button>
            <button style={{margin:'5px'}} className ="btn btn-primary" onClick={this.props.slow}>Slow</button>
            <button style={{margin:'5px'}} className ="btn btn-primary" onClick={this.props.fast}>Fast</button>

            <DropdownButton
              title="Grid Size"
              id="size-menu"
              onSelect={this.handleSelect}
              style={{margin:'5px'}}
            >
                <Dropdown.Item eventKey="1"> 20 x 10 </Dropdown.Item>
                <Dropdown.Item eventKey="2"> 50 x 50 </Dropdown.Item>
                <Dropdown.Item eventKey="3"> 70 x 50 </Dropdown.Item>
            </DropdownButton>
          </ButtonToolbar>

          
            
          

        </div>

    )

  }
}




// App Component
class App extends Component{
constructor(){
  super();
  this.speed=100;
  this.rows=30;
  this.cols=40
  
  this.state={
    generation:0,
    gridFull:Array(this.rows).fill().map( () => Array(this.cols).fill(false))
    }
}

selectBox= (row,col) => {
  // making copy of gridFull and then setState to update state
 let gridCopy = arrClone(this.state.gridFull);
 gridCopy[row][col] = !gridCopy[row][col]
 this.setState({
   gridFull: gridCopy 
 });
}

// randomly seed the grid
seed=() => {
  // create a copy
  let gridCopy = arrClone(this.state.gridFull);
  for (let i=0;i<this.rows;i++){
    for (let j=0;j<this.cols;j++) {
      // if randomly generated number is one , 
     if (Math.floor(Math.random()*4) === 1){
       gridCopy[i][j] = true;
      }
    }
  }
  this.setState({
    gridFull: gridCopy 
  });
}

playButton=() => {
  // every tme play button is clicked we start over
clearInterval(this.intervalId)
this.intervalId =setInterval(this.play,this.speed);
}

pauseButton=() =>{
 clearInterval(this.intervalId);
}

slow = () => {
  this.speed=1000;
  this.playButton();
}

fast = () => {
  this.speed=100;
  this.playButton();
}

clear = () => {
   let grid = Array(this.rows).fill().map( () => Array(this.cols).fill(false));
   this.setState({
     gridFull:grid,
     generation:0
   });
   this.pauseButton();
  }

gridSize = (size) => {
    switch(size){
      case "1":
        this.cols= 20;
        this.rows=10;
      break;
      case "2":
        this.cols= 50;
        this.rows=50;
      break;
      default:
        this.cols= 70;
        this.rows=50;
      }
    this.clear();
  }
     


// Play function with game of life rules  
play=() => {
  let g =this.state.gridFull;
  
  /* using double buffer methodology to ensure grid goes from 
  one generation to other generation in consistent and atomic manner
  without user seeing in-progress / partial state */
  let g2=arrClone(this.state.gridFull);

  for (let i=0;i<this.rows;i++){
    for (let j=0;j<this.cols;j++){
      // count is the no. of neighbors
      let count=0;
      // checking for neighbors , if there is a neighbor , increase count
      if (i>0 && g[i-1][j]) count++;
      if (i>0 && j>0 && g[i-1][j-1]) count++;
      if (i>0 && j<this.cols-1 && g[i-1][j+1]) count++;
      if(j<this.cols-1 && g[i][j+1]) count++;
      if(j>0 && g[i][j-1]) count++;
      if(i<this.rows-1 && g[i+1][j]) count++;
      if(i<this.rows-1 && j>0 && g[i+1][j-1]) count++;
      if(i<this.rows-1 && this.cols-1 && g[i+1][j+1]) count++;
      //if cell is alive and neighbor less than 2 or more than 3 , it dies
      if(g[i][j] &&  (count<2 || count >3 )) g2[i][j]=false;
      // if cell is dead and neighbor exactly 3 , it becomes a live cell
      if (!g[i][j] && count===3) g2[i][j]=true;
      
    }
  }

  this.setState ({
    gridFull: g2,
    generation: this.state.generation+1
  });

}

componentDidMount(){
  this.seed();
  this.playButton();
}


render(){
return (
  <div>
      <h1> Game Of Life </h1>
      <Grid  
      gridFull={this.state.gridFull}
      rows={this.rows}
      cols ={this.cols}
      selectBox={this.selectBox}
      />
      <Buttons
        playButton={this.playButton}
        pauseButton={this.pauseButton}
        seed={this.seed}
        clear={this.clear}
        slow={this.slow}
        fast={this.fast}
        gridSize={this.gridSize}
      />
      <h2>Generations: {this.state.generation}   </h2>
      <div className="infotable">
        <h4>Rules of the Game</h4>
        <ul className="infotext"> 
          <li>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
          <li>Any live cell with two or three live neighbours lives on to the next generation.</li>
          <li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
          <li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
        </ul>
      </div>
      <div className="infotable">
        <h4>About</h4>
        <p className="infotext">
        The Game of Life is a cellular automaton created by John Horton Conway in 1970. 
        Although it is called a game, it actually has zero players. The player only participates 
        in setting the initial state, and the evolution of the patterns begins moving forward. 
        The general setup is a grid with cells showing as 'alive' or 'dead'.
        </p>
      </div>
  </div>

  )

}
};
// as it is a nested array , we have to do a deep clone like this 
function arrClone(arr){
  return JSON.parse(JSON.stringify(arr));
}

export default App;
