# React Native Smart Carousel

[![npm version](https://img.shields.io/badge/npm%20package-v1.0.0-blue.svg)](https://www.npmjs.com/package/react-native-smart-carousel)

## Get started

### Installation

Run: `$ npm install react-native-smart-carousel --save`

### Usage

```javascript
import Carousel from 'react-native-smart-carousel';

const datacarousel = [
  {
      "id": 339964,
      "title": "This is snowman first title",
      "imagePath": "https://cdn.pixabay.com/photo/2017/12/09/16/41/snow-man-3008179_1280.jpg",
  },
  {
      "id": 339403,
      "title": "Snowman",
      "subtitle": "The guy you want",
      "imagePath": "https://cdn.pixabay.com/photo/2015/12/12/22/35/snowman-1090261_1280.jpg",
  },
];

<Carousel
  data={datacarousel}
/>
```

### Properties
| Prop | Description | Default | Required
|---|---|---|---|
|**`data`**|An array with all your items. Read bellow about **Data array structure**. |*None*|Yes|
|**`align`**|Title alignment. Could be `left`, `right` or `center`.|`left`|No|
|**`autoStart`**|Start auto scrolling of the carousel. Boolean `true` or `false`.|`false`|No|
|**`playTime`**|Only works when `autoStart` is activated. It is the interval between each slide in `ms`.|`5000`|No|
|**`titleColor`**|Color title.|`#ffffff`|No|
|**`navigation`**|Display a navigation bar or not. Boolean `true` or `false`.|`true`|No|
|**`navigationColor`**|Color of the current item in the navigation bar.|`#ffffff`|No|
|**`navigationType`**|Navigation bar type. 3 types available: `dots`, `bars` or `squares`. See **navigationType examples** for illustrations.|`dots`|No|
|**`height`**|Carousel height.|`200`|No|
|**`width`**|Carousel width.|`400`|No|
|**`parallax`**|Parallax effect while scrolling. Boolean `true` or `false`.|`true`|No|
|**`overlayPath`**|Image ressource to overlay item image. For example: `{require('../assets/images/itemGradient.png')}`|*None*|No|
|**`onPress`**|A function called when an item is pressed|*None*|No|
|**`parentScrollViewRef`**|Reference of the parent ScrollView. Read bellow about **Make your carousel ScrollView friendly**|*None*|No|

### Data array structure

Your data array **must** be an array of objects with at least an `id` and an `imagePath` key.

| Prop | Description | Required
|---|---|---|
|**`id`**|Item ID.|Yes|
|**`title`**|Item title. Omit this prop if you don't want a title.|No|
|**`subtitle`**|Item subtitle. Omit this prop if you don't want a subtitle.|No|
|**`imagePath`**|Item image path.|Yes|

```javascript
const datacarousel = [
  {
      "id": 339964,
      "title": "This is snowman first title",
      "imagePath": "https://cdn.pixabay.com/photo/2017/12/09/16/41/snow-man-3008179_1280.jpg",
  },
  {
      "id": 339403,
      "title": "Snowman",
      "subtitle": "The guy you want",
      "imagePath": "https://cdn.pixabay.com/photo/2015/12/12/22/35/snowman-1090261_1280.jpg",
  },
];
```

### `navigationType` examples

You can easily customize your navigation bar with `navigationType`: use `dots`, `bars`or `squares` to give a different look at your navigation items.
Remember you can also use `navigationColor` to change the color of the current item in your navigation bar.

![Navigation types](https://github.com/davidsamacoits/react-native-swipeable-parallax-carousel/blob/master/preview/navigationTypes.jpg?raw=true)

*Dots, bars and squares navigation*

### Make your carousel ScrollView friendly

In order to use your carousel component inside a ScrollView and avoid any conflicts while scrolling, you need to use `parentScrollViewRef` prop.

```javascript
<ScrollView
  ref={(c) => { this.parentScrollView = c; }}
>

  ...

  <Carousel
    data={datacarousel}
    parentScrollViewRef={this.parentScrollView}
  />

  ...

</ScrollView>
```

## License

This project is licenced under the [MIT License](http://opensource.org/licenses/mit-license.html).
