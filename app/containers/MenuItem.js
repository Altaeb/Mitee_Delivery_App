import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native'
import Image from '../components/Image'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import navigationService from '../navigationService'

class MenuItem extends Component {
  _handleItemClicked = () => {
    const { id } = this.props
    navigationService.navigate('Detail', {
      itemId: id
    })
  }

  _renderCategory = () => {
    const { categories } = this.props
    const maxLength = categories.length

    return categories.map((category, index) =>
      index < maxLength - 1 ? (
        <Text key={index}>{category} &bull; &nbsp;</Text>
      ) : (
        <Text key={index}>{category}</Text>
      )
    )
  }

  renderStatus = status => {
    const lowerCaseStatus = status && status.toLowerCase()

    if (lowerCaseStatus === 'best') {
      return (
        <View style={styles.statusWrapper}>
          <Icon name="crown" size={16} color="#e5e500" />
          <Text style={styles.status('best')}>Best</Text>
        </View>
      )
    }
    return (
      <View style={styles.statusWrapper}>
        <Text style={styles.status(lowerCaseStatus)}>{status}</Text>
      </View>
    )
  }

  render() {
    const parentPadding = 20
    const { imgSrc, title, status, timePreparation } = this.props

    return (
      <TouchableWithoutFeedback onPress={this._handleItemClicked}>
        <View style={styles.wrapper}>
          <Image src={imgSrc} parentPadding={parentPadding} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.categories}>{this._renderCategory()}</Text>
          {this.renderStatus(status)}
          <View style={styles.costWrapper}>
            <Text style={styles.mainCost}>{`${timePreparation} - ${parseInt(
              timePreparation
            ) + 5}`}</Text>
            <Text style={styles.subCost}>min</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 30
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 5
  },
  categories: {
    fontSize: 14,
    marginTop: 5,
    color: 'grey'
  },
  statusWrapper: {
    flex: 1,
    marginTop: 5,
    flexDirection: 'row'
  },
  status: status => {
    const general = {
      fontWeight: '400'
    }
    if (status === 'best') {
      return {
        ...general,
        marginLeft: 5,
        color: '#e5e500'
      }
    }
    if (status === 'new') {
      return {
        ...general,
        color: 'red'
      }
    }
    if (status === 'hot') {
      return {
        ...general,
        color: 'green'
      }
    }
  },
  costWrapper: {
    position: 'absolute',
    bottom: 45,
    right: 10,
    width: 80,
    height: 50,
    borderRadius: 45,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainCost: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    width: '100%'
  },
  subCost: {
    fontWeight: '100',
    fontSize: 14,
    color: 'gray'
  }
})

export default MenuItem
