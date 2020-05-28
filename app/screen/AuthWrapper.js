import React, { Component } from 'react'
import { connect } from 'react-redux'
import Login from './Login'
import UserInfo from './UserInfo'

class AuthWrapper extends Component {
  render() {
    const { token } = this.props.auth

    if (!token) return <Login />
    return <UserInfo />
  }
}

export default connect(state => ({
  auth: state.auth
}))(AuthWrapper)
