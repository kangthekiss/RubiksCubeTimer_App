import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableWithoutFeedback
} from 'react-native'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      time: 0,
      start: 0,
      isStarted: false,
      longPress: false,
      bgColor: '#202120',
      scramble: [],
      scrambleLength: 25,
      faces: ['R', 'L', 'U', 'D', 'F', 'B'],
      modefiers: ['', "'", '2']
    }
  }

  componentDidMount() {
    this.generateScramble()
  }

  random = length => Math.floor(Math.random() * length)

  generateScramble = () => {
    const { scrambleLength, faces, modefiers } = this.state
    let count = 0,
      randomFace,
      randomModifier,
      move = '',
      moves = []

    while (count < scrambleLength) {
      randomFace = faces[this.random(faces.length)]
      randomModifier = modefiers[this.random(modefiers.length)]

      move = randomFace + randomModifier

      // Don't move the same face twice
      if (count > 0 && move.charAt(0) === moves[count - 1].charAt(0)) continue

      // example: Don't move R L R'
      if (count > 1 && move.charAt(0) === moves[count - 2].charAt(0)) {
        console.log(count)
        console.log(move)
        console.log(moves[count - 2])
        continue
      }

      moves.push(move)
      count++
    }

    console.log(moves)
    this.setState({ scramble: moves })
  }

  startTimer = () => {
    if (!this.state.isStarted) {
      this.setState({
        time: 0,
        start: Date.now() - 0,
        isStarted: true
      })

      this.time = setInterval(() => {
        this.setState({ time: Date.now() - this.state.start })
      }, 1)
    }
  }

  stopTimer = () => {
    clearInterval(this.time)
    this.generateScramble()
    this.setState({ isStarted: false })
  }

  _onPress = () => {
    if (this.state.isStarted) {
      this.stopTimer()
    }

    this.setState({ bgColor: '#B72626' })

    setTimeout(() => {
      this.setState({ bgColor: '#202120' })
    }, 100)
  }

  _onLongPress = () => {
    this.setState({ bgColor: '#26A946', longPress: true })
  }

  _onPressOut = () => {
    if (this.state.longPress) {
      this.setState({ longPress: false })
      this.startTimer()
    }
  }

  _renderTimer = () => {
    const { time } = this.state

    let minutes = ('0' + Math.floor(time / 60000)).slice(-2) // no limit 60, 61, 62, ...n
    let seconds = ('0' + (Math.floor(time / 1000) % 60)).slice(-2) // max 59
    let centiseconds = ('0' + (Math.floor(time / 10) % 100)).slice(-2) // max 100

    if (minutes > 0) {
      return (
        <Text style={{ fontWeight: 'bold', fontSize: 50, color: '#FFFFFF' }}>
          {minutes}:{seconds}.{centiseconds}
        </Text>
      )
    }

    return (
      <Text style={{ fontWeight: 'bold', fontSize: 50, color: '#FFFFFF' }}>
        {seconds}.{centiseconds}
      </Text>
    )
  }

  _renderScramble = () => {
    return (
      <Text
        style={{
          textAlign: 'center',
          color: '#FFFFFF',
          fontWeight: 'bold',
          fontSize: 20
        }}
      >
        {this.state.scramble.join('   ')}
      </Text>
    )
  }

  render() {
    return (
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        onPress={this._onPress}
        onLongPress={this._onLongPress}
        onPressOut={this._onPressOut}
        delayLongPress={350}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: this.state.bgColor
          }}
        >
          <StatusBar barStyle="default" backgroundColor="gray" />

          {!this.state.isStarted && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '15%',
                width: '100%',
                justifyContent: 'center',
                padding: 25
                // borderBottomColor: '#FFFFFF',
                // borderBottomWidth: 0.5
              }}
            >
              {this._renderScramble()}
            </View>
          )}

          {this._renderTimer()}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default App
