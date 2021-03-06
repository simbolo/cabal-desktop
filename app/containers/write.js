import form from 'get-form-data'
import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import { addMessage, onCommand } from '../actions'

const mapStateToProps = state => {
  var cabal = state.cabals[state.currentCabal]
  return {
    addr: state.currentCabal,
    cabal,
    users: cabal.users
  }
}

const mapDispatchToProps = dispatch => ({
  addMessage: ({addr, message}) => dispatch(addMessage({addr, message})),
  onCommand: ({addr, message}) => dispatch(onCommand({addr, message}))
})

class writeScreen extends Component {
  constructor (props) {
    super(props)
    this.minimumHeight = 48
    this.defaultHeight = 17 + this.minimumHeight
  }

  onKeyDown (e) {
    const {cabal} = this.props
    if (e.key === 'Tab') {
      var el = document.querySelector('#message-bar')
      var line = el.value
      var users = Object.keys(cabal.users).sort()
      var pattern = (/^(\w+)$/)
      var match = pattern.exec(line)

      if (match) {
        users = users.filter(user => user.startsWith(match[0]))
        if (users.length > 0) el.value = users[0] + ': '
      }
    }
  }

  onsubmit (e) {
    const data = form(e.target)
    var el = document.querySelector('#message-bar')
    el.value = ''
    const {addr, addMessage, onCommand} = this.props
    var opts = {message: data.message, addr}
    if (data.message.startsWith('/')) onCommand(opts)
    else addMessage(opts)
    e.preventDefault()
    e.stopPropagation()
  }

  render () {
    const { cabal } = this.props

    if (!cabal) {
      return (
        <Fragment>
          <div />
        </Fragment>
      )
    }
    return (
      <div className={'composerContainer'}>
        <div className={'composer'}>
          {/* <div className={'composer__meta'}><img src='static/images/icon-composermeta.svg' /></div> */}
          <div className={'composer__input'}>
            <form onSubmit={this.onsubmit.bind(this)}>
              <input
                id='message-bar'
                name='message'
                onKeyDown={this.onKeyDown.bind(this)}
                aria-label='Type a message and press enter'
                placeholder='Write a message'
              />
            </form>
          </div>
          {/* <div className={'composer__other'}><img src='static/images/icon-composerother.svg' /></div> */}
        </div>
      </div>
    )
  }
}

const WriteContainer = connect(mapStateToProps, mapDispatchToProps)(writeScreen)

export default WriteContainer
