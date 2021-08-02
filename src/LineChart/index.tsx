import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Animated,
  Easing,
  Text,
  ColorValue,
} from 'react-native';
import {styles} from './styles';
import Svg, {
  Path,
  LinearGradient,
  Stop,
  Circle,
  Rect,
  Text as CanvasText,
} from 'react-native-svg';
import {svgPath, bezierCommand} from '../utils';

type propTypes = {
  height?: number;
  noOfSections?: number;
  maxValue?: number;
  stepHeight?: number;
  stepValue?: number;
  spacing?: number;
  initialSpacing?: number;
  data?: any;
  data2?: any;
  thickness?: number;
  thickness1?: number;
  thickness2?: number;
  rotateLabel?: Boolean;
  isAnimated?: Boolean;
  animationDuration?: number;
  animationEasing?: any;
  animateTogether?: boolean;
  xAxisThickness?: number;
  xAxisColor?: ColorValue;
  hideRules?: Boolean;
  rulesColor?: ColorValue;
  rulesThickness?: number;
  showVerticalRules?: Boolean;
  verticalRulesThickness?: number;
  verticalRulesColor?: ColorValue;
  verticalRulesZIndex?: number;
  hideAxesAndRules?: Boolean;
  areaChart?: Boolean;

  disableScroll?: Boolean;
  showScrollIndicator?: Boolean;

  //Indices

  showYAxisIndices?: Boolean;
  showXAxisIndices?: Boolean;
  yAxisIndicesHeight?: number;
  xAxisIndicesHeight?: number;
  yAxisIndicesWidth?: number;
  xAxisIndicesWidth?: number;
  xAxisIndicesColor?: ColorValue;
  yAxisIndicesColor?: ColorValue;

  color?: string;
  color1?: string;
  color2?: string;
  yAxisThickness?: number;
  yAxisColor?: ColorValue;
  yAxisTextStyle?: any;
  showFractionalValues?: Boolean;
  yAxisLabelWidth?: number;
  hideYAxisText?: Boolean;

  backgroundColor?: ColorValue;
  curved?: Boolean;
  horizSections?: Array<sectionType>;

  //Data points

  hideDataPoints?: Boolean;
  dataPointsHeight?: number;
  dataPointsWidth?: number;
  dataPointsRadius?: number;
  dataPointsColor?: string;
  dataPointsShape?: string;
  hideDataPoints1?: Boolean;
  dataPointsHeight1?: number;
  dataPointsWidth1?: number;
  dataPointsRadius1?: number;
  dataPointsColor1?: string;
  dataPointsShape1?: string;
  hideDataPoints2?: Boolean;
  dataPointsHeight2?: number;
  dataPointsWidth2?: number;
  dataPointsRadius2?: number;
  dataPointsColor2?: string;
  dataPointsShape2?: string;

  startFillColor?: string;
  endFillColor?: string;
  startOpacity?: number;
  endOpacity?: number;
  startFillColor1?: string;
  endFillColor1?: string;
  startOpacity1?: number;
  endOpacity1?: number;
  startFillColor2?: string;
  endFillColor2?: string;
  startOpacity2?: number;
  endOpacity2?: number;
  gradientDirection?: string;

  textFontSize?: number;
  textColor?: string;
  textFontSize1?: number;
  textColor1?: string;
  textFontSize2?: number;
  textColor2?: string;
};
type itemType = {
  value?: number;
  onPress?: any;
  frontColor?: ColorValue;
  sideColor?: ColorValue;
  topColor?: ColorValue;
  showGradient?: Boolean;
  gradientColor?: any;
  label: String;
  labelTextStyle?: any;
  topLabelComponent?: Function;
  topLabelContainerStyle?: any;
  disablePress?: any;
  text?: string;
  textShiftX?: number;
  textShiftY?: number;
  textColor?: string;
  textFontSize?: number;
};

type sectionType = {
  value: number;
};

export const LineChart = (props: propTypes) => {
  const [points, setPoints] = useState('');
  const [points2, setPoints2] = useState('');
  const [fillPoints, setFillPoints] = useState('');
  const [fillPoints2, setFillPoints2] = useState('');
  const containerHeight = props.height || 200;
  const noOfSections = props.noOfSections || 10;
  const horizSections = [{value: 0}];
  const maxValue = props.maxValue || 200;
  const stepHeight = props.stepHeight || containerHeight / noOfSections;
  const stepValue = props.stepValue || maxValue / noOfSections;
  const spacing = props.spacing === 0 ? 0 : props.spacing || 60;
  const initialSpacing =
    props.initialSpacing === 0 ? 0 : props.initialSpacing || 40;
  const data = props.data || [];
  const data2 = props.data2 || [];
  const thickness = props.thickness || 2;
  const thickness1 = props.thickness1;
  const thickness2 = props.thickness2;
  const rotateLabel = props.rotateLabel || false;
  const isAnimated = props.isAnimated || false;
  const animationDuration = props.animationDuration || 800;
  const animateTogether = props.animateTogether || false;
  const hideDataPoints1 =
    props.hideDataPoints || props.hideDataPoints1 || false;
  const hideDataPoints2 =
    props.hideDataPoints || props.hideDataPoints2 || false;

  const color1 = props.color1 || props.color || 'black';
  const color2 = props.color2 || props.color || 'black';

  const startFillColor1 =
    props.startFillColor1 || props.startFillColor || 'gray';
  const endFillColor1 = props.endFillColor1 || props.endFillColor || 'white';
  const startOpacity1 = props.startOpacity1 || props.startOpacity || 1;
  const endOpacity1 = props.endOpacity1 || props.endOpacity || 1;
  const startFillColor2 =
    props.startFillColor2 || props.startFillColor || 'gray';
  const endFillColor2 = props.endFillColor2 || props.endFillColor || 'white';
  const startOpacity2 = props.startOpacity2 || props.startOpacity || 1;
  const endOpacity2 = props.endOpacity2 || props.endOpacity || 1;

  const rulesThickness =
    props.rulesThickness === 0 ? 0 : props.rulesThickness || 1;
  const rulesColor = props.rulesColor || 'lightgray';
  const verticalRulesThickness =
    props.verticalRulesThickness === 0 ? 0 : props.verticalRulesThickness || 1;
  const verticalRulesColor = props.verticalRulesColor || 'lightgray';
  const verticalRulesZIndex = props.verticalRulesZIndex || -1;

  const gradientDirection = props.gradientDirection || 'vertical';
  // const animationEasing = props.animationEasing || Easing.ease
  // const opacity = props.opacity || 1;
  const opacValue = new Animated.Value(0);

  const widthValue = new Animated.Value(0);
  const widthValue2 = new Animated.Value(0);

  const xAxisThickness = props.xAxisThickness || 1;
  const xAxisColor = props.xAxisColor || 'black';

  const hideRules = props.hideRules || false;
  const areaChart = props.areaChart || false;

  const showVerticalRules = props.showVerticalRules || false;

  const showYAxisIndices = props.showYAxisIndices || false;
  const showXAxisIndices = props.showXAxisIndices || false;
  const yAxisIndicesHeight = props.yAxisIndicesHeight || 4;
  const xAxisIndicesHeight = props.xAxisIndicesHeight || 2;
  const yAxisIndicesWidth = props.yAxisIndicesWidth || 2;
  const xAxisIndicesWidth = props.xAxisIndicesWidth || 4;
  const xAxisIndicesColor = props.xAxisIndicesColor || 'black';
  const yAxisIndicesColor = props.yAxisIndicesColor || 'black';

  const yAxisThickness = props.yAxisThickness || 1;
  const yAxisColor = props.yAxisColor || 'black';
  const yAxisTextStyle = props.yAxisTextStyle;
  const showFractionalValues = props.showFractionalValues || false;
  const yAxisLabelWidth = props.yAxisLabelWidth || 35;
  const hideYAxisText = props.hideYAxisText || false;

  const dataPointsHeight1 =
    props.dataPointsHeight1 || props.dataPointsHeight || 2;
  const dataPointsWidth1 = props.dataPointsWidth1 || props.dataPointsWidth || 2;
  const dataPointsRadius1 =
    props.dataPointsRadius1 || props.dataPointsRadius || 2;
  const dataPointsColor1 =
    props.dataPointsColor1 || props.dataPointsColor || 'black';
  const dataPointsShape =
    props.dataPointsShape || props.dataPointsShape || 'circular';

  const dataPointsHeight2 =
    props.dataPointsHeight2 || props.dataPointsHeight || 2;
  const dataPointsWidth2 = props.dataPointsWidth2 || props.dataPointsWidth || 2;
  const dataPointsRadius2 =
    props.dataPointsRadius2 || props.dataPointsRadius || 2;
  const dataPointsColor2 =
    props.dataPointsColor2 || props.dataPointsColor || 'blue';
  const dataPointsShape2 =
    props.dataPointsShape2 || props.dataPointsShape || 'circular';

  const textFontSize1 = props.textFontSize1 || props.textFontSize || 10;
  const textFontSize2 = props.textFontSize2 || props.textFontSize || 10;
  const textColor1 = props.textColor1 || props.textColor || 'gray';
  const textColor2 = props.textColor2 || props.textColor || 'gray';

  const backgroundColor = props.backgroundColor || 'transparent';

  const disableScroll = props.disableScroll || false;
  const showScrollIndicator = props.showScrollIndicator || false;

  // console.log('data', data);
  horizSections.pop();
  for (let i = 0; i <= noOfSections; i++) {
    horizSections.push({value: maxValue - stepValue * i});
  }

  let totalWidth = initialSpacing;
  data.forEach((item: itemType) => {
    totalWidth += spacing;
  });

  useEffect(() => {
    // console.log('comes here............')
    decreaseWidth();
    labelsAppear();
    setTimeout(
      () => {
        decreaseWidth2();
      },
      animateTogether ? 0 : animationDuration,
    );
  });

  useEffect(() => {
    let pp = '',
      pp2 = '';
    if (!props.curved) {
      for (let i = 0; i < data.length; i++) {
        pp +=
          'L' +
          (initialSpacing - dataPointsWidth1 / 2 + spacing * i) +
          ' ' +
          (containerHeight +
            10 -
            ((data[i].value || maxValue / 2) * containerHeight) / maxValue) +
          ' ';
        if (data2.length) {
          pp2 +=
            'L' +
            (initialSpacing - dataPointsWidth2 / 2 + spacing * i) +
            ' ' +
            (containerHeight +
              10 -
              ((data2[i].value || maxValue / 2) * containerHeight) / maxValue) +
            ' ';
        }
      }
      setPoints(pp.replace('L', 'M'));
      setPoints2(pp2.replace('L', 'M'));

      /***************************          For Area Charts          *************************/
      if (areaChart) {
        let ppp = '',
          ppp2 = '';

        ppp =
          'L' +
          (initialSpacing - dataPointsWidth1 / 2) +
          ' ' +
          (containerHeight + 10 - xAxisThickness) +
          ' ';
        ppp += pp;
        ppp +=
          'L' +
          (initialSpacing -
            dataPointsWidth1 / 2 +
            spacing * (data.length - 1)) +
          ' ' +
          (containerHeight + 10 - xAxisThickness);
        ppp +=
          'L' +
          (initialSpacing - dataPointsWidth1 / 2) +
          ' ' +
          (containerHeight + 10 - xAxisThickness) +
          ' ';

        if (data2.length) {
          ppp2 =
            'L' +
            (initialSpacing - dataPointsWidth2 / 2) +
            ' ' +
            (containerHeight + 10 - xAxisThickness) +
            ' ';
          ppp2 += pp2;
          ppp2 +=
            'L' +
            (initialSpacing -
              dataPointsWidth2 / 2 +
              spacing * (data.length - 1)) +
            ' ' +
            (containerHeight + 10 - xAxisThickness);
          ppp2 +=
            'L' +
            (initialSpacing - dataPointsWidth2 / 2) +
            ' ' +
            (containerHeight + 10 - xAxisThickness) +
            ' ';
          setFillPoints2(ppp2.replace('L', 'M'));
        }

        setFillPoints(ppp.replace('L', 'M'));
      }

      // console.log('pp-------->', pp);
      // console.log('ppp-------->', ppp);
      // console.log('pp2-------->', pp2);
      // console.log('ppp2-------->', ppp2);

      /*************************************************************************************/
    } else {
      let p1Array = [],
        p2Array = [];
      for (let i = 0; i < data.length; i++) {
        p1Array.push([
          initialSpacing - dataPointsWidth1 / 2 + spacing * i,
          containerHeight + 10 - (data[i].value * containerHeight) / maxValue,
        ]);
        if (data2.length) {
          p2Array.push([
            initialSpacing - dataPointsWidth2 / 2 + spacing * i,
            containerHeight +
              10 -
              (data2[i].value * containerHeight) / maxValue,
          ]);
        }
      }
      let xx = svgPath(p1Array, bezierCommand);
      let xx2 = svgPath(p2Array, bezierCommand);
      // console.log('xx', xx);
      setPoints(xx);
      setPoints2(xx2);

      /***************************          For Area Charts          *************************/

      // console.log('xx---->>>', xx)
      if (areaChart) {
        xx =
          'M ' +
          (initialSpacing - dataPointsWidth1 / 2) +
          ',' +
          (containerHeight + 10 - xAxisThickness) +
          ' ' +
          'L ' +
          (initialSpacing - dataPointsWidth1 / 2) +
          ',' +
          (containerHeight +
            10 -
            ((data[0].value || maxValue / 2) * containerHeight) / maxValue) +
          ' ' +
          xx +
          ' ' +
          'L ' +
          (initialSpacing -
            dataPointsWidth1 / 2 +
            spacing * (data.length - 1)) +
          ',' +
          (containerHeight + 10 - xAxisThickness) +
          ' ' +
          'L ' +
          (initialSpacing - dataPointsWidth1 / 2) +
          ',' +
          (containerHeight + 10 - xAxisThickness) +
          ' ';
        setFillPoints(xx);
        // console.log('xx later ---->>>', xx)

        if (data2.length) {
          xx2 =
            'M ' +
            (initialSpacing - dataPointsWidth2 / 2) +
            ',' +
            (containerHeight + 10 - xAxisThickness) +
            ' ' +
            'L ' +
            (initialSpacing - dataPointsWidth2 / 2) +
            ',' +
            (containerHeight +
              10 -
              ((data2[0].value || maxValue / 2) * containerHeight) / maxValue) +
            ' ' +
            xx2 +
            ' ' +
            'L ' +
            (initialSpacing -
              dataPointsWidth2 / 2 +
              spacing * (data2.length - 1)) +
            ',' +
            (containerHeight + 10 - xAxisThickness) +
            ' ' +
            'L ' +
            (initialSpacing - dataPointsWidth2 / 2) +
            ',' +
            (containerHeight + 10 - xAxisThickness) +
            ' ';
          setFillPoints2(xx2);
        }
      }

      /*************************************************************************************/
    }
  }, [data]);

  const renderLabel = (index: number, label: String, labelTextStyle: any) => {
    return (
      <View
        style={[
          {
            position: 'absolute',
            bottom: 30,
            zIndex: 10,
            width: spacing,
            // borderColor: 'red',
            // borderWidth: 0.5,
            // top: (value * containerHeight / maxValue) - 10,
            left: initialSpacing + spacing * index - spacing / 2,
            // opacity: appearingOpacity,
            // backgroundColor: 'yellow',
            justifyContent: 'center',
            // alignSelf: 'center'
          },
          rotateLabel && {transform: [{rotate: '60deg'}]},
        ]}>
        <Text style={[labelTextStyle, {textAlign: 'center'}]} numberOfLines={1}>
          {label || ''}
        </Text>
      </View>
    );
  };

  const renderAnimatedLabel = (
    index: number,
    label: String,
    labelTextStyle: any,
  ) => {
    // console.log('label', label);
    return (
      <Animated.View
        style={[
          {
            height: rotateLabel ? 40 : 20,
            // width: rotateLabel ? 30 : 100,
            // backgroundColor: 'yellow',
            position: 'absolute',
            bottom: rotateLabel ? 10 : 30,
            zIndex: 10,
            width: spacing,
            // top: (value * containerHeight / maxValue) - 10,
            left: initialSpacing + spacing * index - spacing / 2,
            opacity: appearingOpacity,
          },
          rotateLabel && {transform: [{rotate: '60deg'}]},
        ]}>
        <Text style={[labelTextStyle, {textAlign: 'center'}]} numberOfLines={1}>
          {label || ''}
        </Text>
      </Animated.View>
    );
  };

  const labelsAppear = () => {
    opacValue.setValue(0);
    Animated.timing(opacValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  const appearingOpacity = opacValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const decreaseWidth = () => {
    // console.log('i m called, totalWidth is', totalWidth)
    widthValue.setValue(0);
    Animated.timing(widthValue, {
      toValue: 1,
      duration: animationDuration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };
  const decreaseWidth2 = () => {
    widthValue2.setValue(0);
    Animated.timing(widthValue2, {
      toValue: 1,
      duration: animationDuration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const animatedWidth = widthValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, totalWidth],
  });

  const animatedWidth2 = widthValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, totalWidth],
  });

  // const sectionsOverlay = () => {
  //     return (
  //         <Animated.View
  //             style={{
  //                 backgroundColor: 'white',
  //                 position: 'absolute',
  //                 zIndex: 1,
  //                 width: animatedWidth
  //             }}>
  //             {renderHorizSections()}
  //         </Animated.View>
  //     )
  // }

  const renderHorizSections = () => {
    return (
      <>
        {props.hideAxesAndRules !== true &&
          horizSections.map((sectionItems, index) => {
            return (
              <View key={index} style={styles.horizBar}>
                <View
                  style={[
                    styles.leftLabel,
                    {
                      height:
                        index === noOfSections ? stepHeight / 2 : stepHeight,
                      width: yAxisLabelWidth,
                    },
                  ]}>
                  {!hideYAxisText && index !== noOfSections && (
                    <Text
                      numberOfLines={1}
                      ellipsizeMode={'clip'}
                      style={yAxisTextStyle}>
                      {showFractionalValues
                        ? sectionItems.value || ''
                        : sectionItems.value
                        ? sectionItems.value.toString().split('.')[0]
                        : ''}
                    </Text>
                  )}
                </View>
                <View
                  style={[
                    index === noOfSections
                      ? styles.lastLeftPart
                      : styles.leftPart,
                    {
                      borderLeftWidth: yAxisThickness,
                      borderColor: yAxisColor,
                      backgroundColor: backgroundColor,
                    },
                  ]}>
                  {index === noOfSections ? (
                    <View
                      style={[
                        styles.line,
                        {height: xAxisThickness, backgroundColor: xAxisColor},
                      ]}
                    />
                  ) : hideRules ? null : (
                    <View
                      style={[
                        styles.line,
                        {
                          height: rulesThickness,
                          backgroundColor: rulesColor,
                        },
                      ]}
                    />
                  )}
                  {showXAxisIndices && index !== noOfSections ? (
                    <View
                      style={{
                        height: xAxisIndicesHeight,
                        width: xAxisIndicesWidth,
                        left: xAxisIndicesWidth / -2,
                        backgroundColor: xAxisIndicesColor,
                      }}
                    />
                  ) : null}
                </View>
              </View>
            );
          })}
      </>
    );
  };

  const renderLine = (
    points: any,
    currentLineThickness: number | undefined,
    color: string,
    fillPoints: any,
    startFillColor: string,
    endFillColor: string,
    startOpacity: number,
    endOpacity: number,
  ) => {
    return (
      <View
        style={{
          position: 'absolute',
          height: containerHeight + 10,
          bottom: 60, //stepHeight * -0.5 + xAxisThickness,
          width: totalWidth,
          zIndex: -1,
          // backgroundColor: 'rgba(200,150,150,0.1)'
        }}>
        <Svg>
          <Path
            d={points}
            fill="none"
            stroke={color}
            strokeWidth={currentLineThickness || thickness}
          />
          {areaChart && (
            <LinearGradient
              id="Gradient"
              x1="0"
              y1="0"
              x2={gradientDirection === 'horizontal' ? '1' : '0'}
              y2={gradientDirection === 'vertical' ? '1' : '0'}>
              <Stop
                offset="0"
                stopColor={startFillColor}
                stopOpacity={startOpacity.toString()}
              />
              <Stop
                offset="1"
                stopColor={endFillColor}
                stopOpacity={endOpacity.toString()}
              />
            </LinearGradient>
          )}
          {areaChart && (
            <Path
              d={fillPoints}
              fill="url(#Gradient)"
              stroke={'transparent'}
              strokeWidth={currentLineThickness || thickness}
            />
          )}
        </Svg>
      </View>
    );
  };

  const renderAnimatedLine = (
    points: any,
    animatedWidth: any,
    currentLineThickness: number | undefined,
    color: string,
    fillPoints: any,
    startFillColor: string,
    endFillColor: string,
    startOpacity: number,
    endOpacity: number,
  ) => {
    // console.log('animatedWidth is-------->', animatedWidth);
    return (
      <Animated.View
        style={{
          position: 'absolute',
          height: containerHeight + 10,
          bottom: 60, //stepHeight * -0.5 + xAxisThickness,
          width: animatedWidth,
          zIndex: -1,
          // backgroundColor: 'wheat',
        }}>
        <Svg>
          <Path
            d={points}
            fill="none"
            stroke={color}
            strokeWidth={currentLineThickness || thickness}
          />
          {areaChart && (
            <LinearGradient
              id="Gradient"
              x1="0"
              y1="0"
              x2={gradientDirection === 'horizontal' ? '1' : '0'}
              y2={gradientDirection === 'vertical' ? '1' : '0'}>
              <Stop
                offset="0"
                stopColor={startFillColor}
                stopOpacity={startOpacity.toString()}
              />
              <Stop
                offset="1"
                stopColor={endFillColor}
                stopOpacity={endOpacity.toString()}
              />
            </LinearGradient>
          )}
          {areaChart && (
            <Path
              d={fillPoints}
              fill="url(#Gradient)"
              stroke={'transparent'}
              strokeWidth={currentLineThickness || thickness}
            />
          )}
          {!hideDataPoints1 &&
            data.map((item: itemType, index: number) => {
              if (dataPointsShape === 'rectangular') {
                return (
                  <>
                    <Rect
                      x={initialSpacing - dataPointsWidth1 + spacing * index}
                      y={
                        containerHeight -
                        dataPointsHeight1 / 2 +
                        10 -
                        (item.value * containerHeight) / maxValue
                      }
                      width={dataPointsWidth1}
                      height={dataPointsHeight1}
                      fill={dataPointsColor1}
                    />
                    {item.text && (
                      <CanvasText
                        fill={item.textColor || textColor1}
                        fontSize={item.textFontSize || textFontSize1}
                        x={
                          initialSpacing -
                          dataPointsWidth1 +
                          spacing * index +
                          (item.textShiftX || 0)
                        }
                        y={
                          containerHeight -
                          dataPointsHeight1 / 2 +
                          10 -
                          (item.value * containerHeight) / maxValue +
                          (item.textShiftY || 0)
                        }>
                        {item.text}
                      </CanvasText>
                    )}
                  </>
                );
              }
              return (
                <>
                  <Circle
                    cx={initialSpacing - dataPointsWidth1 / 2 + spacing * index}
                    cy={
                      containerHeight +
                      10 -
                      (item.value * containerHeight) / maxValue
                    }
                    r={dataPointsRadius1}
                    fill={dataPointsColor1}
                  />
                  {item.text && (
                    <CanvasText
                      fill={item.textColor || textColor1}
                      fontSize={item.textFontSize || textFontSize1}
                      x={
                        initialSpacing -
                        dataPointsWidth1 +
                        spacing * index +
                        (item.textShiftX || 0)
                      }
                      y={
                        containerHeight -
                        dataPointsHeight1 / 2 +
                        10 -
                        (item.value * containerHeight) / maxValue +
                        (item.textShiftY || 0)
                      }>
                      {item.text}
                    </CanvasText>
                  )}
                </>
              );
            })}
          {!hideDataPoints2 &&
            data2.map((item: itemType, index: number) => {
              if (dataPointsShape2 === 'rectangular') {
                return (
                  <>
                    <Rect
                      x={initialSpacing - dataPointsWidth2 + spacing * index}
                      y={
                        containerHeight -
                        dataPointsHeight2 / 2 +
                        10 -
                        (item.value * containerHeight) / maxValue
                      }
                      width={dataPointsWidth2}
                      height={dataPointsHeight2}
                      fill={dataPointsColor2}
                    />
                    {item.text && (
                      <CanvasText
                        fill={item.textColor || textColor2}
                        fontSize={item.textFontSize || textFontSize2}
                        x={
                          initialSpacing -
                          dataPointsWidth2 +
                          spacing * index +
                          (item.textShiftX || 0)
                        }
                        y={
                          containerHeight -
                          dataPointsHeight2 / 2 +
                          10 -
                          (item.value * containerHeight) / maxValue +
                          (item.textShiftY || 0)
                        }>
                        {item.text}
                      </CanvasText>
                    )}
                  </>
                );
              }
              return (
                <>
                  <Circle
                    cx={initialSpacing - dataPointsWidth2 / 2 + spacing * index}
                    cy={
                      containerHeight +
                      10 -
                      (item.value * containerHeight) / maxValue
                    }
                    r={dataPointsRadius2}
                    fill={dataPointsColor2}
                  />
                  {item.text && (
                    <CanvasText
                      fill={item.textColor || textColor2}
                      fontSize={item.textFontSize || textFontSize2}
                      x={
                        initialSpacing -
                        dataPointsWidth2 +
                        spacing * index +
                        (item.textShiftX || 0)
                      }
                      y={
                        containerHeight -
                        dataPointsHeight2 / 2 +
                        10 -
                        (item.value * containerHeight) / maxValue +
                        (item.textShiftY || 0)
                      }>
                      {item.text}
                    </CanvasText>
                  )}
                </>
              );
            })}
        </Svg>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, {height: containerHeight}]}>
      {props.hideAxesAndRules !== true && renderHorizSections()}
      {/* {sectionsOverlay()} */}
      <ScrollView
        horizontal
        contentContainerStyle={{
          height: containerHeight + 130,
          width: totalWidth,
          // backgroundColor: 'yellow'
        }}
        scrollEnabled={!disableScroll}
        showsHorizontalScrollIndicator={showScrollIndicator}
        style={{
          marginLeft: yAxisLabelWidth + yAxisThickness,
          position: 'absolute',
          bottom: stepHeight * -0.5 - 60, //stepHeight * -0.5 + xAxisThickness,
          paddingRight: 100,
        }}>
        {showVerticalRules &&
          data.map((item: itemType, index: number) => {
            return (
              <View
                key={index}
                style={{
                  position: 'absolute',
                  zIndex: verticalRulesZIndex || -1,
                  height: containerHeight + 15,
                  width: verticalRulesThickness,
                  backgroundColor: verticalRulesColor,
                  bottom: 60,
                  left:
                    index * spacing + (initialSpacing - dataPointsWidth1 / 2),
                }}
              />
            );
          })}

        {showYAxisIndices &&
          data.map((item: itemType, index: number) => {
            return (
              <View
                key={index}
                style={{
                  position: 'absolute',
                  height: yAxisIndicesHeight,
                  width: yAxisIndicesWidth,
                  backgroundColor: yAxisIndicesColor,
                  bottom: 60 - yAxisIndicesHeight / 2,
                  left:
                    index * spacing +
                    (initialSpacing - yAxisIndicesWidth / 2) -
                    3,
                }}
              />
            );
          })}

        {isAnimated
          ? renderAnimatedLine(
              points,
              animatedWidth,
              thickness1,
              color1,
              fillPoints,
              startFillColor1,
              endFillColor1,
              startOpacity1,
              endOpacity1,
            )
          : renderLine(
              points,
              thickness1,
              color1,
              fillPoints,
              startFillColor1,
              endFillColor1,
              startOpacity1,
              endOpacity1,
            )}
        {points2
          ? isAnimated
            ? renderAnimatedLine(
                points2,
                animatedWidth2,
                thickness2,
                color2,
                fillPoints2,
                startFillColor2,
                endFillColor2,
                startOpacity2,
                endOpacity2,
              )
            : renderLine(
                points2,
                thickness2,
                color2,
                fillPoints2,
                startFillColor2,
                endFillColor2,
                startOpacity2,
                endOpacity2,
              )
          : null}
        {data.map((item: itemType, index: number) => {
          // console.log('item', item)
          return (
            <View key={index}>
              {isAnimated
                ? renderAnimatedLabel(index, item.label, item.labelTextStyle)
                : renderLabel(index, item.label, item.labelTextStyle)}
              {/* {renderLabel(index, item.label, item.labelTextStyle)} */}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};