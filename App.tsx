import {
  Canvas,
  Circle,
  LinearGradient,
  matchFont,
  Rect,
  RoundedRect,
  Shader,
  Text,
  useClock,
  vec,
} from "@shopify/react-native-skia";
import React, { useState } from "react";
import { Platform, StyleSheet, View, Text as RNText, TouchableOpacity } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import {
  BRICK_HEIGHT,
  BRICK_MIDDLE,
  BRICK_ROW_LENGTH,
  BRICK_WIDTH,
  COURSE_CODES,
  height,
  BALL_COLOR,
  PADDLE_HEIGHT,
  PADDLE_MIDDLE,
  PADDLE_WIDTH,
  TOTAL_BRICKS,
  width,
  RADIUS,
} from "./constants";
import { animate, createBouncingExample } from "./sample";
import { BrickInterface, CircleInterface, PaddleInterface } from "./types";
import { shader } from "./shader";

interface Props {
  idx: number;
  brick: BrickInterface;
}

// Use a reliable font and handle potential null case
const fontFamily = Platform.select({ ios: "Helvetica", default: "sans-serif" });
const fontStyle = {
  fontFamily,
  fontSize: 20,
  fontWeight: "bold" as const,
};
const font = matchFont(fontStyle) || null;

const resolution = vec(width, height);

const Brick = ({ idx, brick }: Props) => {
  const color = useDerivedValue(() => {
    return brick.canCollide.value ? "orange" : "transparent";
  }, [brick.canCollide]);

  const textOpacity = useDerivedValue(() => {
    return brick.canCollide.value ? 1 : 0;
  }, [brick.canCollide]);

  // Center text inside the brick
  const textX = brick.x.value + (brick.width - (font?.measureText(COURSE_CODES[idx] || "").width || 0)) / 2;
  const textY = brick.y.value + brick.height / 2 + 2; // Vertically centered with slight offset

  return (
    <>
      <RoundedRect
        key={idx}
        x={brick.x.value}
        y={brick.y.value}
        width={brick.width}
        height={brick.height}
        color={color}
        r={8}
      >
        <LinearGradient
          start={vec(5, 300)}
          end={vec(4, 50)}
          colors={["red", "orange"]}
        />
      </RoundedRect>
      {font && (
        <Text
          x={textX}
          y={textY}
          text={COURSE_CODES[idx] || ""}
          font={font}
          color="white"
          opacity={textOpacity}
        />
      )}
    </>
  );
};

export default function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  const brickCount = useSharedValue(0);
  const clock = useClock();

  const circleObject: CircleInterface = {
    type: "Circle",
    id: 0,
    x: useSharedValue(0),
    y: useSharedValue(0),
    r: RADIUS,
    m: 0,
    ax: 0,
    ay: 0,
    vx: 0,
    vy: 0,
  };

  const rectangleObject: PaddleInterface = {
    type: "Paddle",
    id: 0,
    x: useSharedValue(PADDLE_MIDDLE),
    y: useSharedValue(height - 100),
    m: 0,
    ax: 0,
    ay: 0,
    vx: 0,
    vy: 0,
    height: PADDLE_HEIGHT,
    width: PADDLE_WIDTH,
  };

  const bricks: BrickInterface[] = Array(TOTAL_BRICKS)
    .fill(0)
    .map((_, idx) => {
      const margin = 45;
      const availableWidth = width - 2 * margin;
      const brickSpacingX = availableWidth / (BRICK_ROW_LENGTH - 1);
      const brickSpacingY = 45;
      const row = Math.floor(idx / BRICK_ROW_LENGTH);
      const col = idx % BRICK_ROW_LENGTH;
      const startingX = margin + col * brickSpacingX - BRICK_WIDTH / 2;
      const startingY = 120 + row * brickSpacingY;

      return {
        type: "Brick",
        id: idx,
        x: useSharedValue(startingX),
        y: useSharedValue(startingY),
        m: 0,
        ax: 0,
        ay: 0,
        vx: 0,
        vy: 0,
        height: BRICK_HEIGHT,
        width: BRICK_WIDTH,
        canCollide: useSharedValue(true),
      };
    });

  const resetGame = () => {
    "worklet";
    rectangleObject.x.value = PADDLE_MIDDLE;
    createBouncingExample(circleObject);
    bricks.forEach((brick) => {
      brick.canCollide.value = true;
    });
    brickCount.value = 0;
  };

  createBouncingExample(circleObject);

  useFrameCallback((frameInfo) => {
    const deltaTime = frameInfo.timeSincePreviousFrame
      ? frameInfo.timeSincePreviousFrame / 1000
      : 0.016; // Fallback to 60 FPS

    if (brickCount.value === TOTAL_BRICKS || brickCount.value === -1) {
      circleObject.vx = 0;
      circleObject.vy = 0;
      return;
    }

    animate([circleObject, rectangleObject, ...bricks], deltaTime * 1000, brickCount);
  });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      if (brickCount.value === TOTAL_BRICKS || brickCount.value === -1) {
        resetGame();
      }
    })
    .onChange(({ x }) => {
      rectangleObject.x.value = Math.max(0, Math.min(x - PADDLE_WIDTH / 2, width - PADDLE_WIDTH));
    });

  const opacity = useDerivedValue(() => {
    return brickCount.value === TOTAL_BRICKS || brickCount.value === -1 ? 1 : 0;
  }, [brickCount]);

  const textPosition = useDerivedValue(() => {
    const endText = brickCount.value === TOTAL_BRICKS ? "YOU WIN" : "YOU LOSE";
    return font ? (width - (font.measureText(endText).width || 0)) / 2 : 0;
  }, [font]);

  const gameEndingText = useDerivedValue(() => {
    return brickCount.value === TOTAL_BRICKS ? "YOU WIN" : "YOU LOSE";
  }, []);

  const uniforms = useDerivedValue(() => {
    return {
      iResolution: resolution,
      iTime: clock.value * 0.001,
    };
  }, [clock]);

  const WelcomeScreen = () => (
    <View style={styles.welcomeContainer}>
      <Canvas style={{ flex: 1 }}>
        <Rect x={0} y={0} width={width} height={height}>
          <Shader source={shader} uniforms={uniforms} />
        </Rect>
      </Canvas>
      <View style={styles.welcomeOverlay}>
        <RNText style={styles.welcomeSubtitle}>COMPUTER ENGINEERING</RNText>
        <RNText style={styles.welcomeTitle}>Brick Breaker</RNText>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => setIsGameStarted(true)}
        >
          <RNText style={styles.startButtonText}>Start Game</RNText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const GameScreen = () => (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <View style={styles.container}>
          <Canvas style={{ flex: 1 }}>
            <Rect x={0} y={0} width={width} height={height}>
              <Shader source={shader} uniforms={uniforms} />
            </Rect>
            <Circle
              cx={circleObject.x}
              cy={circleObject.y}
              r={RADIUS}
              color={BALL_COLOR}
            />
            <RoundedRect
              x={rectangleObject.x}
              y={rectangleObject.y}
              width={rectangleObject.width}
              height={rectangleObject.height}
              color="white"
              r={8}
            />
            {bricks.map((brick, idx) => (
              <Brick key={idx} idx={idx} brick={brick} />
            ))}
            {font && (
              <>
                <Text x={120} y={70} text={`Level: First Year`} font={font} color="white" />
                <Text x={20} y={100} text={`Score: ${score}`} font={font} color="white" />
                <Text x={250} y={100} text={`Semester: 1`} font={font} color="white" />
                <Text
                  x={textPosition}
                  y={height / 2}
                  text={gameEndingText}
                  font={font}
                  color="white"
                  opacity={opacity}
                />
              </>
            )}
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              color="red"
              opacity={opacity}
            >
              <LinearGradient
                start={vec(0, 200)}
                end={vec(0, 500)}
                colors={["#4070D3", "#EA2F86"]}
              />
            </Rect>
          </Canvas>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );

  return isGameStarted ? <GameScreen /> : <WelcomeScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  welcomeContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  welcomeOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeSubtitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginBottom: 150,
    textAlign: "center",
  },
  welcomeTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    marginBottom: 40,
    textAlign: "center",
  },
  startButton: {
    backgroundColor: "#77FF23",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
});