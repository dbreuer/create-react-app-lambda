import React, { Component } from "react"
import logo from "./logo.svg"
import "./App.css"
import CustomReader from "./CustomReader"

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <CustomReader placeholder={<img src={logo} className="App-logo" alt="logo" />} />
        </header>
      </div>
    )
  }
}

export default App
