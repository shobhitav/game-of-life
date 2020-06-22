import React,{Component}  from 'react';
import './index.css'; 

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
const width=(this.props.cols*12);
var rowsArr=[];
var boxClass="";
for (var i=0;i<this.props.rows;i++){
  for (var j=0;j<this.props.rows;j++) {
    let boxId=i + "_" + j;

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
)
}

}




// App
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
 let gridCopy = arrClone(this.state.gridFull);
 gridCopy[row][col] = ! gridCopy[row][col]
 this.setState({
   gridFull: gridCopy 
 })
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
      <h2>Generations: {this.state.generation}   </h2>
  </div>

  )

}
}
function arrClone(arr){
  return JSON.parse(JSON.stringify(arr));
}

export default App;
