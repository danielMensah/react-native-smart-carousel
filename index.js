import React, { Component } from 'react';
import PropTypes  from 'prop-types';
import { View, ImageBackground, Image, Text, TouchableOpacity, Animated, Dimensions, PanResponder } from 'react-native';
import styles from './styles';

const SWIPE_THRESHOLD = 0.25;
var timer;

class SmartCarousel extends Component {

  // Default props //
  static defaultProps = {
    height: 200,
    width: 400,
    navigationColor: '#ffffff',
    onPress: () => {},
    autoPlay: false,
    playTime: 5000
  };

  // Class constructor
  //
  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (event, gesture) => {
        return Math.abs(gesture.dx) > 5;
      },
      onPanResponderGrant: () => {
        // Deactivate parent scrollview
        // this.props.parentScrollViewRef.setNativeProps({ scrollEnabled: false });
        if (this.props.parentScrollViewRef) this.props.parentScrollViewRef.setNativeProps({ scrollEnabled: false });
      },
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD * this.state.screenWidth) {
          // Can't swipe if it's the beginning
          if (this.state.currentItem === 0) {
            this._resetPosition();
          } else this._forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD * this.state.screenWidth) {
          // Can't swipe if it's the end
          if (this.state.currentItem === this.props.data.length - 1) {
            this._resetPosition();
          } else this._forceSwipe('left');
        } else {
          this._resetPosition();
        }
        // Reactivate parent scrollview
        if (this.props.parentScrollViewRef) this.props.parentScrollViewRef.setNativeProps({ scrollEnabled: true });
      }
    });
    this.panResponder = panResponder;
    this.position = position;

    this.state = {
      currentItem: 0,
      nextItem: 0,
      screenWidth: Dimensions.get('window').width,
    };

    const {autoPlay, playTime} = this.props;

    if (autoPlay) {
      timer = setInterval(() => {
        this._forceSwipe('left');
      }, playTime);
    }
  }

  componentWillUnmount() {
    clearInterval(timer);
  }

  // Force swipe

  _forceSwipe(direction) {
    const { autoPlay } = this.props;
    const { screenWidth, currentItem } = this.state;

    let distance = (direction === 'right') ? screenWidth : -screenWidth;
    // Calculate nextItem
    const totalItems = this.props.data.length;
    let newitem = (direction === 'right') ? currentitem - 1 : currentitem + 1;

    if (autoPlay && newitem === totalItems) {
      distance = screenWidth * (totalItems - 1);
      newitem = 0;
    }

    this.setState({ nextItem: newitem });
    Animated.spring(this.position, {
      toValue: { x: distance, y: 0 },
    }).start(() => this._onSwipeComplete(newitem));
  }

  // on SwipeComplete
  //
  _onSwipeComplete(newitem) {
    this.position.setValue({ x: 0, y: 0 });
    this.setState({ currentItem: newitem });
  }

  // Reset position
  //
  _resetPosition() {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  // Get overlay
  //
  _getOverlay(overlayPath, height) {
    if (overlayPath) return <Image source={overlayPath} style={[styles.overlay, { height, width: this.state.screenWidth}]} />;
    return null;
  }

  // Get title
  //
  _getTitle(item, titleColor) {
    if (item.title) {
      return (
        <View style={[styles.itemTitleContainer, this._getTitleAlign(), this._getTitlePadding()]}>
          <Text style={[styles.itemTitle, { color: titleColor }]}>{item.title}</Text>
          {item.subtitle &&
          <Text style={[styles.itemSubtitle, { color: titleColor }]}>{item.subtitle}</Text>
          }
        </View>
      );
    }
    return null;
  }

  // Get title alignement
  //
  _getTitleAlign() {
    if (this.props.align === 'center') return { alignItems: 'center' };
    if (this.props.align === 'right') return { alignItems: 'flex-end' };
    return { alignItems: 'flex-start' };
  }

  // Get title padding (if navigation active)
  //
  _getTitlePadding() {
    if (this.props.navigation) return { paddingBottom: 40 };
    return null;
  }

  // Get style for each individual item
  //
  _getItemStyle(index) {
    const { position } = this;
    const { currentItem, screenWidth } = this.state;
    const { parallax } = this.props;

    // Current item zIndex (for parallax effect)
    const zIndex = (index === currentItem) ? 0 : 1;

    // Default margin based on the item position
    const defaultmargin = ((index - currentItem) * screenWidth);
    let deltaleft = screenWidth;
    if (parallax && index === currentItem) deltaleft = screenWidth / 4;
    if (!parallax && currentItem === this.props.data.length - 1) deltaleft = screenWidth / 4;
    let deltaright = screenWidth;
    if (parallax && index === currentItem) deltaright = screenWidth / 4;
    if (!parallax && currentItem === 0) deltaright = screenWidth / 4;
    const margin = position.x.interpolate({
      inputRange: [-screenWidth, 0, screenWidth],
      outputRange: [defaultmargin - deltaleft, defaultmargin, defaultmargin + deltaright],
    });
    return { left: margin, zIndex, elevation: zIndex };
  }

  // Render items method
  //
  _renderItems() {
    const { data, height, overlayPath, titleColor, onPress } = this.props;

    return data.map((item, index) => {
      return (
        <Animated.View
          key={item.id}
          {...this.panResponder.panHandlers}
          style={[styles.itemContainer, { height, width: this.state.screenWidth }, this._getItemStyle(index)]}
        >
          <TouchableOpacity
            onPress={() => onPress(item.id)}
            style={styles.touchableContainer}
            activeOpacity={0.98}
          >
            <ImageBackground
              source={item.imagePath}
              style={styles.itemImage}
            >
              {this._getOverlay(overlayPath, height)}
              {this._getTitle(item, titleColor)}
            </ImageBackground>
          </TouchableOpacity>
        </Animated.View>
      );
    });
  }

  // Render navigation
  //
  _renderNavigation() {
    const { navigation } = this.props;

    if (navigation) {
      return (
        <View style={styles.navigationContainer}>
          {this._renderNavigationItems()}
        </View>
      );
    }
    return null;
  }

  // Render navigation item
  //
  _renderNavigationItems() {
    const { data, navigationColor, navigationType } = this.props;
    // Type of item (dots == default, bars, squares)
    let typeItem = null;
    if (navigationType === 'bars') typeItem = styles.navigationItemBars;
    if (navigationType === 'squares') typeItem = styles.navigationItemSquares;

    return data.map((item, index) => {
      // Current item selection
      let currentItem = null;
      if (index === this.state.nextItem) currentItem = { backgroundColor: navigationColor, transform: [{ scale: 1.25 }] };
      return (
        <Animated.View
          key={index}
          style={[styles.navigationItem, typeItem, currentItem]}
        />
      );
    });
  }

  // onLayout method to resize when orientation change
  //
  _onLayout() {
    this.setState({ screenWidth: Dimensions.get('window').width });
  }

  // Render method
  //
  render() {
    return (
      <View onLayout={this._onLayout.bind(this)}>
        <View style={{ height: this.props.height, width: this.state.screenWidth }}>
          {this._renderItems()}
          {this._renderNavigation()}
        </View>
      </View>
    );
  }
}

SmartCarousel.propTypes = {
  data: PropTypes.array.isRequired,
  align: PropTypes.string,
  titleColor: PropTypes.string,
  navigation: PropTypes.bool,
  parallax: PropTypes.bool,
  overlayPath: PropTypes.any,
  height: PropTypes.number,
  navigationType: PropTypes.string,
  width: PropTypes.number,
  navigationColor: PropTypes.string,
  onPress: PropTypes.func,
  parentScrollViewRef: PropTypes.any,
  autoPlay: PropTypes.bool,
  playTime: PropTypes.number
};

export default SmartCarousel;
