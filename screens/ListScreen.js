import React, {Component} from 'react';
import {ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';

import * as Constants from '../constants';

export default class ListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
      spotList: [],
    };
  }

  componentDidMount() {
    this.GetSpots();

    this.back = this.props.navigation.addListener('focus', () => {
      this.setState({
        loading: true,
      });
      this.GetSpots();
    });
  }

  componentWillUnmount() {
    this.back();
  }

  /* Fetch Spots and Favorites from API and place in spotList */
  GetSpots = async () => {
    try {
      const response = await fetch(Constants.SPOTS_URL);
      const result = await response.json();

      this.setState({
        /* add the favorite bool field to spots */
        spotList: result.map(spot => ({
          ...spot,
          favorite: false,
        })),
      });

      try {
        const favResponse = await fetch(Constants.FAVORITES_URL);
        const favResult = await favResponse.json();

        /* Update favorite boolean for each item in spotList */
        let list = this.state.spotList;
        for (var i = 0; i < favResult.length; i++) {
          for (var j = 0; j < list.length; j++) {
            if (list[j].id === favResult[i].spot.toString()) {
              list[j].favorite = true;
              list[j].favoriteObj = favResult[i];
            }
          }
        }

        this.setState({
          spotList: list,
        });
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  /* Add a new favorite entry in API endpoint */
  AddFavorite = async (id, index) => {
    if (this.state.spotList[index].favorite) {
      return;
    }

    /* Update favorite state to change icon locally */
    let list = this.state.spotList;
    list[index].favorite = true;

    this.setState({
      spotList: list,
    });

    try {
      const response = await fetch(Constants.FAVORITES_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spot: id,
        }),
      });
      const result = await response.json();

      let l = this.state.spotList;
      l[index].favoriteObj = result;

      this.setState({
        spotList: l,
      });
    } catch (error) {
      console.error(error);
    }
  };

  /* Remove the favorite entry in API endpoint */
  RemoveFavorite = async (id, index) => {
    if (!this.state.spotList[index].favorite) {
      return;
    }

    /* Update favorite state to change icon locally */
    let list = this.state.spotList;
    list[index].favorite = false;

    this.setState({
      spotList: list,
    });

    try {
      const favId = this.state.spotList[index].favoriteObj.id;
      const response = await fetch(Constants.FAVORITES_URL + '/' + favId, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spot: id,
        }),
      });
      const result = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  onRefresh = () => {
    this.setState({loading: true, refreshing: true});
    this.GetSpots();

    if (!this.state.loading) {
      this.setState({refreshing: false});
    }
  };

  favoriteIcon = (id, index) => (
    <Icon
      name={this.state.spotList[index].favorite ? 'heart' : 'hearto'}
      size={28}
      color={this.state.spotList[index].favorite ? '#dd0000' : '#000000'}
      style={styles.favoriteIcon}
      onPress={() => {
        this.state.spotList[index].favorite
          ? this.RemoveFavorite(id, index)
          : this.AddFavorite(id, index);
      }}
    />
  );

  keyExtractor = (item, index) => index.toString();
  renderItem = ({item, index}) => (
    <ListItem
      title={item.name}
      subtitle={item.country}
      rightIcon={this.favoriteIcon(item.id, index)}
      bottomDivider
      onPress={() => {
        this.props.navigation.navigate('DetailsScreen', {
          id: item.id,
          name: item.name,
          country: item.country,
          favorite: this.state.spotList[index].favorite,
          favoriteObj: this.state.spotList[index].favorite
            ? this.state.spotList[index].favoriteObj
            : null,
          latitude: item.lat,
          longitude: item.long,
          windProb: item.probability,
          whenToGo: item.month,
        });
      }}
    />
  );

  render() {
    const {spotList, loading, refreshing} = this.state;

    if (!loading && !refreshing) {
      return (
        <View>
          <FlatList
            keyExtractor={this.keyExtractor}
            data={spotList}
            renderItem={this.renderItem}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
          />
        </View>
      );
    } else {
      return (
        <View style={styles.loadingIcon}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  loadingIcon: {
    flex: 1,
    justifyContent: 'center',
  },
  favoriteIcon: {
    marginStart: 8,
    marginEnd: 8,
  },
});
