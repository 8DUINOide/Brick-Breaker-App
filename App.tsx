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
  Path,
  Skia,
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
  runOnJS,
} from "react-native-reanimated";
import {
  BRICK_HEIGHT,
  BRICK_MIDDLE,
  BRICK_ROW_LENGTH,
  BRICK_WIDTH,
  LEVELS,
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
  currentLevel: number;
}

const fontFamily = Platform.select({ ios: "Helvetica", default: "sans-serif" });
const fontStyle = {
  fontFamily,
  fontSize: 20,
  fontWeight: "bold" as const,
};
const font = matchFont(fontStyle) || null;

const largeFontStyle = {
  fontFamily,
  fontSize: 40,
  fontWeight: "bold" as const,
};
const largeFont = matchFont(largeFontStyle) || null;

const smallFontStyle = {
  fontFamily,
  fontSize: 20,
  fontWeight: "bold" as const,
};
const smallFont = matchFont(smallFontStyle) || null;

const resolution = vec(width, height);

const createStarPath = (cx: number, cy: number, outerRadius: number) => {
  const path = Skia.Path.Make();
  const innerRadius = outerRadius / 2;
  const points = 5;
  const angleStep = Math.PI / points;

  for (let i = 0; i < 2 * points; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * angleStep - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) {
      path.moveTo(x, y);
    } else {
      path.lineTo(x, y);
    }
  }
  path.close();
  return path;
};

const Brick = ({ idx, brick, currentLevel }: Props) => {
  const color = useDerivedValue(() => {
    return brick.canCollide.value ? "orange" : "transparent";
  }, [brick.canCollide]);

  const textOpacity = useDerivedValue(() => {
    return brick.canCollide.value ? 1 : 0;
  }, [brick.canCollide]);

  const courseCode = useDerivedValue(() => {
    return LEVELS[currentLevel].courseCodes[idx] || "";
  }, [currentLevel]);

  const textX = useDerivedValue(() => {
    const textWidth = font?.measureText(courseCode.value).width || 0;
    return brick.x.value + (brick.width - textWidth) / 2;
  }, [brick.x, courseCode]);

  const textY = useDerivedValue(() => {
    return brick.y.value + brick.height / 2 + 2;
  }, [brick.y]);

  return (
    <>
      <RoundedRect
        key={idx}
        x={brick.x}
        y={brick.y}
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
          text={courseCode}
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
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const sharedScore = useSharedValue(0);
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

  const resetGameWorklet = () => {
    "worklet";
    rectangleObject.x.value = PADDLE_MIDDLE;
    createBouncingExample(circleObject);
    bricks.forEach((brick) => {
      brick.canCollide.value = true;
    });
    brickCount.value = 0;
  };

  const handleLevelTransition = (advanceLevel: boolean) => {
    if (advanceLevel && currentLevel < LEVELS.length - 1) {
      setCurrentLevel(currentLevel + 1);
    } else if (advanceLevel && currentLevel === LEVELS.length - 1) {
      setIsGameCompleted(true);
    }
  };

  const resetGame = (advanceLevel: boolean) => {
    resetGameWorklet();
    runOnJS(handleLevelTransition)(advanceLevel);
  };

  createBouncingExample(circleObject);

  useFrameCallback((frameInfo) => {
    const deltaTime = frameInfo.timeSincePreviousFrame
      ? frameInfo.timeSincePreviousFrame / 1000
      : 0.016;

    if (brickCount.value === TOTAL_BRICKS || brickCount.value === -1) {
      circleObject.vx = 0;
      circleObject.vy = 0;
      return;
    }

    animate([circleObject, rectangleObject, ...bricks], deltaTime * 1000, brickCount, sharedScore);
  });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      if (brickCount.value === TOTAL_BRICKS) {
        runOnJS(resetGame)(true);
      } else if (brickCount.value === -1) {
        runOnJS(resetGame)(false);
      }
    })
    .onChange(({ x }) => {
      rectangleObject.x.value = Math.max(0, Math.min(x - PADDLE_WIDTH / 2, width - PADDLE_WIDTH));
    });

  const opacity = useDerivedValue(() => {
    return brickCount.value === TOTAL_BRICKS || brickCount.value === -1 ? 1 : 0;
  }, [brickCount]);

  const textPosition = useDerivedValue(() => {
    const endText = brickCount.value === TOTAL_BRICKS ? "LEVEL UP" : "TRY AGAIN";
    return largeFont ? (width - (largeFont.measureText(endText).width || 0)) / 2 : 0;
  }, [largeFont]);

  const subTextPosition = useDerivedValue(() => {
    const subText = brickCount.value === TOTAL_BRICKS ? "You can now proceed to the next semester" : "DON'T GIVE UP";
    return smallFont ? (width - (smallFont.measureText(subText).width || 0)) / 2 : 0;
  }, [smallFont]);

  const gameEndingText = useDerivedValue(() => {
    return brickCount.value === TOTAL_BRICKS ? "LEVEL UP" : "TRY AGAIN";
  }, []);

  const gameSubText = useDerivedValue(() => {
    return brickCount.value === TOTAL_BRICKS ? "You can now proceed to the next semester" : "DON'T GIVE UP";
  }, []);

  const scoreText = useDerivedValue(() => {
    return `Score: ${sharedScore.value}`;
  }, [sharedScore]);

  const levelText = useDerivedValue(() => {
    return `Level: ${LEVELS[currentLevel].year}`;
  }, [currentLevel]);

  const semesterText = useDerivedValue(() => {
    return `${LEVELS[currentLevel].semester}`;
  }, [currentLevel]);

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

  const GameCompletedScreen = () => (
    <View style={styles.welcomeContainer}>
      <Canvas style={{ flex: 1 }}>
        <Rect x={0} y={0} width={width} height={height}>
          <Shader source={shader} uniforms={uniforms} />
        </Rect>
      </Canvas>
      <View style={styles.welcomeOverlay}>
        <RNText style={styles.welcomeSubtitle}>CONGRATULATIONS!</RNText>
        <RNText style={styles.welcomeTitle}>Curriculum Completed</RNText>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            setCurrentLevel(0);
            setIsGameCompleted(false);
            setIsGameStarted(true);
            resetGame(false);
          }}
        >
          <RNText style={styles.startButtonText}>Restart Game</RNText>
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
              <Brick key={idx} idx={idx} brick={brick} currentLevel={currentLevel} />
            ))}
            {font && largeFont && smallFont && (
              <>
                <Text x={120} y={70} text={levelText} font={font} color="white" />
                <Text x={20} y={100} text={scoreText} font={font} color="white" />
                <Text x={250} y={100} text={semesterText} font={font} color="white" />
                <Text
                  x={textPosition}
                  y={height / 2 - 50}
                  text={gameEndingText}
                  font={largeFont}
                  color="white"
                  opacity={opacity}
                />
                <Text
                  x={subTextPosition}
                  y={height / 2 + 50}
                  text={gameSubText}
                  font={smallFont}
                  color="white"
                  opacity={opacity}
                />
                {Array(3).fill(0).map((_, index) => {
                  const cx = width / 2 - 50 + index * 50;
                  const cy = height / 2;
                  const starColor = useDerivedValue(() => {
                    if (brickCount.value === TOTAL_BRICKS) {
                      return "#FFFF00";
                    } else if (brickCount.value === -1) {
                      return "#808080";
                    }
                    return "transparent";
                  }, [brickCount]);

                  return (
                    <Path
                      key={index}
                      path={createStarPath(cx, cy, 15)}
                      color={starColor}
                      opacity={opacity}
                      style="fill"
                    />
                  );
                })}
              </>
            )}
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              color="transparent"
              opacity={opacity}
            >
              <LinearGradient
                start={vec(0, 0)}
                end={vec(0, height)}
                colors={["#4070D3", "#EA2F86"]}
              />
            </Rect>
          </Canvas>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );

  return isGameCompleted ? <GameCompletedScreen /> : isGameStarted ? <GameScreen /> : <WelcomeScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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