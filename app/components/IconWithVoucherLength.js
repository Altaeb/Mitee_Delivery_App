import { PureComponent } from 'react'
import { withBadge } from 'react-native-elements'
import { compose, branch } from 'recompose'
import { connect } from 'react-redux'

class IconWithVoucherLength extends PureComponent {
  render() {
    return this.props.children
  }
}

const renderWithBadge = branch(
  props => props.vouchers.length > 0,
  withBadge(props => props.vouchers.length, {
    top: -3,
    right: -3,
    status: 'success'
  })
)

const enhance = compose(
  connect(state => ({
    vouchers: state.auth.vouchers
  })),
  renderWithBadge
)

export default enhance(IconWithVoucherLength)
