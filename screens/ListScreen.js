import React, {Component} from 'react';
import {ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  ScrollView,
  Text,
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
      countryFilter: '',
      windFilter: '',
      loading: true,
      refreshing: false,
      networkErr: false,
      spotList: [],
    };
  }

  componentDidMount() {
    this.back = this.props.navigation.addListener('focus', () => {
      //console.log('Focused');
      if (!this.props.route.params) {
        //console.log('No Params');
        //console.log(this.state);
        this.GetSpots();
        return;
      }

      //console.log('Params');
      this.setState({
        /* Get filter screen navigation params */
        countryFilter: this.props.route.params.countryFilter
          ? this.props.route.params.countryFilter
          : '',
        windFilter: this.props.route.params.windFilter
          ? this.props.route.params.windFilter > 100
            ? 100
            : this.props.route.params.windFilter
          : '',
      });

      this.GetSpots();
      return;
    });
  }

  componentWillUnmount() {
    this.back();
  }

  /* Fetch Spots and Favorites from API and place in spotList */
  GetSpots = async () => {
    this.setState({loading: true});

    /* Fetch Spots */
    try {
      const response = await fetch(Constants.SPOTS_URL);
      const result = await response.json();

      let l = result;
      /* Filter results if countryFilter is non-empty string */
      if (this.state.countryFilter !== '') {
        l = l
          .filter(
            e =>
              e.country.toLowerCase() ===
              this.state.countryFilter.toLowerCase(),
          )
          .map(e => {
            return e;
          });
      }
      /* Filter results if windFilter is non-empty string */
      if (this.state.windFilter !== '') {
        l = l
          .filter(e => e.probability >= this.state.windFilter)
          .map(e => {
            return e;
          });
      }

      this.setState({
        /* add the favorite bool field to spots */
        spotList: l.map(spot => ({
          ...spot,
          favorite: false,
        })),
      });

      /* Fetch Favorites */
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
          networkErr: false,
        });

        /* Cache new data (only if not filtered) */
        if (this.state.countryFilter === '' && this.state.windFilter === '') {
          this.addCacheSpots();
        }
      } catch (error) {
        if (error.message === 'Network request failed') {
          /* Try to fetch spots from cache */
          this.getCacheSpots();
        }
      }
    } catch (error) {
      if (error.message === 'Network request failed') {
        /* Try to fetch spots from cache */
        this.getCacheSpots();
      }
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
      console.log(error);
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
      //const response =
      await fetch(Constants.FAVORITES_URL + '/' + favId, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spot: id,
        }),
      });
      //const result = await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  /* Add spotList to cache */
  addCacheSpots = async () => {
    try {
      await AsyncStorage.setItem('spots', JSON.stringify(this.state.spotList));
    } catch (error) {
      console.log(error);
    }
  };

  /* Get spotList from cache */
  getCacheSpots = async () => {
    try {
      const res = await AsyncStorage.getItem('spots');
      var spots = JSON.parse(res);

      if (spots && spots.length > 0) {
        /* Filter results if countryFilter is non-empty string */
        if (this.state.countryFilter !== '') {
          spots = spots
            .filter(
              e =>
                e.country.toLowerCase() ===
                this.state.countryFilter.toLowerCase(),
            )
            .map(e => {
              return e;
            });
        }
        /* Filter results if windFilter is non-empty string */
        if (this.state.windFilter !== '') {
          spots = spots
            .filter(e => e.probability >= this.state.windFilter)
            .map(e => {
              return e;
            });
        }

        this.setState({
          spotList: spots,
        });
      } else {
        this.setState({
          networkErr: true,
        });
      }
    } catch (cacheError) {
      console.log(cacheError);
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
    const {spotList, loading, refreshing, networkErr} = this.state;

    if (!loading && !refreshing) {
      if (networkErr) {
        return (
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.onRefresh.bind(this)}
              />
            }>
            <View>
              <Text style={styles.noSpotText}>No network connection.</Text>
            </View>
          </ScrollView>
        );
      } else {
        if (spotList.length > 0) {
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
            <ScrollView
              contentContainerStyle={styles.scrollView}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.onRefresh.bind(this)}
                />
              }>
              <View>
                <Text style={styles.noSpotText}>No spots found.</Text>
              </View>
            </ScrollView>
          );
        }
      }
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
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  noSpotText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#777777',
  },
});
