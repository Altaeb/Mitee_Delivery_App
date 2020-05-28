import React, { Component } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import MenuItem from './MenuItem'

class ListItem extends Component {
  _renderMenuItem = ({ item }) => {
    if (!item || !item.picture) return null
    return (
      <MenuItem
        imgSrc={item.picture[0].url}
        title={item.name}
        categories={[item.category && item.category.name]}
        id={item.id}
        timePreparation={item.preparingTime}
        status={item.status}
      />
    )
  }

  render() {
    const { datas, refreshing, onRefresh } = this.props

    return (
      <FlatList
        style={{ marginHorizontal: 20, marginBottom: 20 }}
        showsVerticalScrollIndicator={false}
        data={datas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={this._renderMenuItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    )
  }
}

export default ListItem
