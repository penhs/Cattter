import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Dimensions,
  FlatList,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Source for image assets:
// https://pixabay.com/illustrations/calico-cat-kitty-cute-adorable-fun-1732370/

// Global variable
const MAX_IMAGES = 50;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
      loadMore: true,
    };

    // Bind "this" to class methods to prevent loss of context
    this.getData = this.getData.bind(this);
    this.renderLimitReached = this.renderLimitReached.bind(this);
  }

  // Function to fetch image urls from API
  async getData(numImages) {
    const newImages = [];
    const size = this.state.images.length;
    let canLoadMore = size < MAX_IMAGES ? true : false;

    // Build an array of new images to update state with
    for (let i = 0; i < numImages && canLoadMore; i++) {
      // Exit loop and stop fetching images if max images reached
      if (size + i >= MAX_IMAGES) {
        canLoadMore = false;
      }
      // Fetch images if under max images threshold
      else {
        try {
          // Get url to a new image from random.cat
          // const response = await fetch('https://aws.random.cat/meow');
          // const jsonData = await response.json();
          // const imageUrl = jsonData.file;

          // Get url to a new image from thecatapi.com
          const response = await fetch(
            'https://api.thecatapi.com/v1/images/search'
          );
          const jsonData = await response.json();
          const imageUrl = jsonData[0].url;

          // Create new image object and push to newImages[]
          const imageObject = {
            key: `${size + i}`,
            url: `${imageUrl}`,
          };
          newImages.push(imageObject);
        } catch (error) {
          console.error(error);
        }
      }
    }

    // Update state with new image object in an immutable manner
    // Wait for setState to update state since setState is asynchronous
    await this.setState({
      images: [...this.state.images, ...newImages],
      loadMore: canLoadMore,
    });
  }

  // Fetch initial images after mounting
  componentDidMount() {
    this.getData(10);
  }

  // Function to render a footer when max images has been reached
  renderLimitReached() {
    const canLoadMore = this.state.loadMore;
    if (!canLoadMore) {
      return (
        <View style={styles.textContainer}>
          <Text style={styles.text}>You've seen enough cats for today!</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.bannerContainer}>
          <LinearGradient
            colors={['rgba(225, 100, 50, 1.0)', 'rgba(240,240,240, 1.0)']}
            style={styles.banner}
          >
            <Image
              resizeMode="contain"
              style={styles.icon}
              fadeDuration={500}
              source={require('./app/assets/splash.png')}
            />
          </LinearGradient>
        </View>
        <FlatList
          numColumns={2}
          data={this.state.images}
          onEndReached={() => {
            this.getData(4); // Get 4 new images once at end
          }}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => {
            return (
              <View>
                <Image
                  resizeMode="stretch"
                  style={styles.image}
                  fadeDuration={1000}
                  source={{ uri: item.url }}
                />
              </View>
            );
          }}
        />
        {this.renderLimitReached()}
        <StatusBar style="dark" />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(240, 240, 240)',
    flex: 1,
  },
  bannerContainer: {
    height: `10%`,
  },
  banner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: `50%`,
    width: `50%`,
  },
  image: {
    width: Dimensions.get('window').width / 2 - 20,
    height: Dimensions.get('window').width / 2 - 20,
    margin: 10,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: `5%`,
    backgroundColor: 'rgb(215, 215, 215)',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgb(225, 100, 50)',
  },
});
