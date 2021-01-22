import React, { Component } from 'react'

import { CSVReader } from 'react-papaparse'
import styled from 'styled-components'

const Grid = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 5px;
  width: 800px;
  height: 800px;
  flex-wrap: wrap;
`

const Cell = styled.div`
  display: flex;
  flex: 1 1 80px;
  justify-content: center;
  align-items: center;
  background: ${props => 'hsl(' + Math.floor(Math.abs(props.count / 100000)) + ', 50%, 50%)'};
  border-radius: ${props => props.picked ? '50%' : 'none'};
`

export default class CSVReaderClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lotterieNumbers: null,
      picked: null,
    }
  }
  handleOnDrop = (data) => {
    console.log('---------------------------')
    this.calculate(data)
    console.log('---------------------------')
  }

  handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  handleOnRemoveFile = (data) => {
    console.log('---------------------------')
    if (data === null) {
      this.setState({
        lotterieNumbers: null,
        picked: null,
      })
    }
    console.log('---------------------------')
  }

  calculate(data) {
    const numberMap = new Map();
    for (let date of data) {
      let timeStamp = new Date().getTime() / 1000000;
      if (date.data[2]) {
        timeStamp = new Date(date.data[2]).getTime() / 1000000;
      }
      for (let number of [date.data[11], 
        date.data[12], 
        date.data[13], 
        date.data[14], 
        date.data[15]
      ]) {
        
        let numberCount = 0;
        if (number !== undefined) {
          if (numberMap.has(number)) {
            numberCount = numberMap.get(number);
            numberCount = numberCount - timeStamp;
          } 
          numberMap.set(number, numberCount);
        }
      }
    }
    const mapAsc = Array.from(numberMap, ([name, value]) => ({ name, value }));
    const sortedByCount = mapAsc.sort((a, b) => Number(a.value) - Number(b.value));
    this.setState({picked: sortedByCount.slice(0, 10).map(item => item.name)});
    const sortedByNumbers = mapAsc.sort((a, b) => Number(a.name) - Number(b.name));
    this.setState({lotterieNumbers: sortedByNumbers});
  }

  render() {
    return (
      <>
      <CSVReader
        onDrop={this.handleOnDrop}
        onError={this.handleOnError}
        addRemoveButton
        onRemoveFile={this.handleOnRemoveFile}
      >
        <span>Drop CSV file here to upload.</span>
      </CSVReader>
      {this.state.lotterieNumbers ? <Grid>
        {this.state.lotterieNumbers && this.state.lotterieNumbers.map(item => <Cell key={item.name} picked={this.state.picked.includes(item.name)} count={item.value}>{item.name}</Cell>)}
      </Grid> : this.props.placeholder}
      </>
    )
  }
}