import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {ListItem} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';

import * as Constants from '../constants';

export default class DetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spot: this.props.route.params,
    };

    this.props.navigation.setOptions({
      title: this.state.spot.name,
      headerTitleStyle:
        this.state.spot.name.length >= 20 ? {width: '70%'} : {width: '100%'},
      headerRight: this.favoriteIcon,
    });
  }

  static navigationOptions = () => {
    return {
      title: this.state.spot.name,
      headerTitleStyle:
        this.state.spot.name.length >= 20 ? {width: '70%'} : {width: '100%'},
      headerRight: this.favoriteIcon,
    };
  };

  /* Add a new favorite entry in API endpoint */
  AddFavorite = async () => {
    if (this.state.spot.favorite || this.state.spot.favoriteObj != null) {
      return;
    }

    /* Update favorite state to change icon locally */
    let spot = this.state.spot;
    spot.favorite = true;

    this.setState({
      spot: spot,
    });

    this.props.navigation.setOptions({
      headerRight: this.favoriteIcon,
    });

    try {
      const response = await fetch(Constants.FAVORITES_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spot: this.state.spot.id,
        }),
      });
      const result = await response.json();

      spot.favoriteObj = result;

      this.setState({
        spot: spot,
      });
    } catch (error) {
      console.error(error);
    }
  };

  /* Remove the favorite entry in API endpoint */
  RemoveFavorite = async () => {
    if (!this.state.spot.favorite || !this.state.spot.favoriteObj) {
      return;
    }

    /* Update favorite state to change icon locally */
    let spot = this.state.spot;
    spot.favorite = false;

    this.setState({
      spot: spot,
    });

    this.props.navigation.setOptions({
      headerRight: this.favoriteIcon,
    });

    try {
      const favId = this.state.spot.favoriteObj.id;
      const response = await fetch(Constants.FAVORITES_URL + '/' + favId, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spot: this.state.spot.favoriteObj.spot,
        }),
      });
      const result = await response.json();

      spot.favoriteObj = null;
      this.setState({
        spot: spot,
      });
    } catch (error) {
      console.error(error);
    }
  };

  favoriteIcon = () => (
    <Icon
      name={this.state.spot.favorite ? 'heart' : 'hearto'}
      size={30}
      color={this.state.spot.favorite ? '#dd0000' : '#000000'}
      style={styles.favoriteIcon}
      onPress={() => {
        this.state.spot.favorite ? this.RemoveFavorite() : this.AddFavorite();
      }}
    />
  );

  render() {
    return (
      <ScrollView>
        <ListItem
          title="Country"
          titleStyle={styles.title}
          subtitle={this.state.spot.country}
          subtitleStyle={styles.subtitle}
          bottomDivider
        />
        <ListItem
          title="Latitude"
          titleStyle={styles.title}
          subtitle={this.state.spot.latitude.toString()}
          subtitleStyle={styles.subtitle}
          bottomDivider
        />
        <ListItem
          title="Longitude"
          titleStyle={styles.title}
          subtitle={this.state.spot.longitude.toString()}
          subtitleStyle={styles.subtitle}
          bottomDivider
        />
        <ListItem
          title="Wind Probability"
          titleStyle={styles.title}
          subtitle={this.state.spot.windProb.toString() + '%'}
          subtitleStyle={styles.subtitle}
          bottomDivider
        />
        <ListItem
          title="When To Go"
          titleStyle={styles.title}
          subtitle={this.state.spot.whenToGo}
          subtitleStyle={styles.subtitle}
          bottomDivider
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    marginStart: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  subtitle: {
    marginStart: 8,
    fontSize: 16,
  },
  favoriteIcon: {
    marginStart: 8,
    marginEnd: 18,
  },
});
