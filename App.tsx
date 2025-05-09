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
import React, { useState, useCallback } from "react";
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
    return LEVELS[currentLevel].courseCodes[idx]?.code || "";
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
  const [isResetting, setIsResetting] = useState(false);
  const [showPlayMenu, setShowPlayMenu] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false); // New state for How to Play screen
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const unitsEarnedThisLevel = useSharedValue(0); // Units earned in the current level, starts at 0
  const totalUnitsEarned = useSharedValue(0); // Cumulative units across all levels, starts at 0
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
      const startingY = 150 + row * brickSpacingY;

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

  const getUnitsForLevel = (level: number) => {
    if (level === 0) {
      return LEVELS[0].cumulativeTotalUnits; // For the first level, use its cumulative total
    }
    return LEVELS[level].cumulativeTotalUnits - LEVELS[level - 1].cumulativeTotalUnits; // Units for this level
  };

  const resetGameWorklet = () => {
    "worklet";
    rectangleObject.x.value = PADDLE_MIDDLE;
    createBouncingExample(circleObject);
    bricks.forEach((brick) => {
      brick.canCollide.value = true;
    });
    brickCount.value = 0;
    unitsEarnedThisLevel.value = 0; // Reset to 0 when resetting
  };

  const handleLevelTransition = useCallback((advanceLevel: boolean) => {
    if (isResetting) return;
    setIsResetting(true);
    if (advanceLevel && currentLevel < LEVELS.length - 1) {
      const newCompletedLevels = [...completedLevels, currentLevel];
      setCompletedLevels(newCompletedLevels);
      if (!completedLevels.includes(currentLevel)) {
        const unitsForThisLevel = getUnitsForLevel(currentLevel);
        unitsEarnedThisLevel.value = unitsForThisLevel; // Set units earned for this level
        totalUnitsEarned.value += unitsForThisLevel; // Add to total
      } else {
        unitsEarnedThisLevel.value = 0; // Reset to 0 for replayed levels
      }
      setCurrentLevel(currentLevel + 1);
      unitsEarnedThisLevel.value = 0; // Reset for the next level
    } else if (advanceLevel && currentLevel === LEVELS.length - 1) {
      const newCompletedLevels = [...completedLevels, currentLevel];
      setCompletedLevels(newCompletedLevels);
      if (!completedLevels.includes(currentLevel)) {
        const unitsForThisLevel = getUnitsForLevel(currentLevel);
        unitsEarnedThisLevel.value = unitsForThisLevel; // Set units earned for this level
        totalUnitsEarned.value += unitsForThisLevel; // Add to total
      } else {
        unitsEarnedThisLevel.value = 0; // Reset to 0 for replayed levels
      }
      setIsGameCompleted(true);
    } else {
      unitsEarnedThisLevel.value = 0; // Reset to 0 if level not completed (e.g., back button)
    }
    setIsResetting(false);
  }, [currentLevel, isResetting, completedLevels]);

  const resetGame = (advanceLevel: boolean) => {
    resetGameWorklet();
    runOnJS(handleLevelTransition)(advanceLevel);
  };

  const startLevel = (level: number) => {
    setCurrentLevel(level);
    setShowPlayMenu(false);
    setIsGameStarted(true);
    unitsEarnedThisLevel.value = 0; // Reset to 0 when starting a new level
    resetGame(false);
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

    animate([circleObject, rectangleObject, ...bricks], deltaTime * 1000, brickCount, unitsEarnedThisLevel, currentLevel);
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
    const subText = brickCount.value === TOTAL_BRICKS ? "Keep going!" : "DON'T GIVE UP";
    return smallFont ? (width - (smallFont.measureText(subText).width || 0)) / 2 : 0;
  }, [smallFont]);

  const gameEndingText = useDerivedValue(() => {
    return brickCount.value === TOTAL_BRICKS ? "LEVEL UP" : "TRY AGAIN";
  }, []);

  const gameSubText = useDerivedValue(() => {
    return brickCount.value === TOTAL_BRICKS ? "Keep going!" : "DON'T GIVE UP";
  }, []);

  const unitsEarnedText = useDerivedValue(() => {
    const unitsEarned = unitsEarnedThisLevel.value;
    return `Units: ${unitsEarned}`;
  }, [unitsEarnedThisLevel]);

  const totalUnitsText = useDerivedValue(() => {
    const totalUnits = totalUnitsEarned.value;
    return `Total Units: ${totalUnits}`;
  }, [totalUnitsEarned]);

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
        <RNText style={styles.welcomeSubtitle}>COMPUTER ENGINEERING CURRICULUM</RNText>
        <RNText style={styles.welcomeTitle}>Brick Breaker</RNText>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => setShowPlayMenu(true)}
        >
          <RNText style={styles.startButtonText}>Play</RNText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.howToPlayButton}
          onPress={() => setShowHowToPlay(true)}
        >
          <RNText style={styles.howToPlayButtonText}>How to Play</RNText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const HowToPlayScreen = () => (
    <View style={styles.welcomeContainer}>
      <Canvas style={{ flex: 1 }}>
        <Rect x={0} y={0} width={width} height={height}>
          <Shader source={shader} uniforms={uniforms} />
        </Rect>
      </Canvas>
      <View style={styles.welcomeOverlay}>
        <RNText style={styles.welcomeTitle}>How to Play</RNText>
        <RNText style={styles.instructionText}>
          1. Swipe left or right to move the paddle.
        </RNText>
        <RNText style={styles.instructionText}>
          2. Bounce the ball to break all bricks.
        </RNText>
        <RNText style={styles.instructionText}>
          3. Clear all bricks to advance to the next level.
        </RNText>
        <RNText style={styles.instructionText}>
          4. Don’t let the ball fall below the paddle!
        </RNText>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowHowToPlay(false)}
        >
          <RNText style={styles.backButtonText}>Back</RNText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const PlayMenuScreen = () => (
    <View style={styles.welcomeContainer}>
      <Canvas style={{ flex: 1 }}>
        <Rect x={0} y={0} width={width} height={height}>
          <Shader source={shader} uniforms={uniforms} />
        </Rect>
      </Canvas>
      <View style={styles.welcomeOverlay}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowPlayMenu(false)}
        >
          <RNText style={styles.backButtonText}>Back</RNText>
        </TouchableOpacity>
        <RNText style={styles.welcomeTitle}>PLAY</RNText>
        <View style={styles.gridContainer}>
          {LEVELS.map((level, index) => {
            const isUnlocked = index <= currentLevel;
            const isCompleted = completedLevels.includes(index);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.levelButton,
                  isCompleted && styles.activeLevelButton,
                  !isUnlocked && styles.lockedLevelButton,
                ]}
                onPress={() => isUnlocked && startLevel(index)}
                disabled={!isUnlocked}
              >
                <RNText style={styles.levelButtonText}>
                  {isUnlocked ? index + 1 : "🔒"}
                </RNText>
                <RNText style={styles.levelButtonSubText}>
                  {`Level: ${level.year} Semester: ${level.semester}`}
                </RNText>
              </TouchableOpacity>
            );
          })}
        </View>
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
        <RNText style={styles.welcomeSubtitle}>
          Total Units: {totalUnitsEarned.value}
        </RNText>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            setCurrentLevel(0);
            setIsGameCompleted(false);
            setIsGameStarted(true);
            totalUnitsEarned.value = 0;
            setCompletedLevels([]);
            unitsEarnedThisLevel.value = 0;
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
                <Text x={20} y={100} text={unitsEarnedText} font={font} color="white" />
                <Text x={20} y={130} text={totalUnitsText} font={font} color="white" />
                <Text x={230} y={100} text={semesterText} font={font} color="white" />
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              unitsEarnedThisLevel.value = 0; // Reset units when going back
              setIsGameStarted(false);
            }}
          >
            <RNText style={styles.backButtonText}>Back</RNText>
          </TouchableOpacity>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );

  return isGameCompleted ? (
    <GameCompletedScreen />
  ) : showHowToPlay ? (
    <HowToPlayScreen />
  ) : showPlayMenu ? (
    <PlayMenuScreen />
  ) : isGameStarted ? (
    <GameScreen />
  ) : (
    <WelcomeScreen />
  );
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
    marginBottom: 20, // Add spacing between buttons
  },
  howToPlayButton: {
    backgroundColor: "#FFA500", // Orange color for How to Play button
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  howToPlayButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  instructionText: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    marginVertical: 10,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#FF4444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  levelButton: {
    width: 120,
    height: 120,
    backgroundColor: "#D3D3D3",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  activeLevelButton: {
    backgroundColor: "#77FF23",
  },
  lockedLevelButton: {
    backgroundColor: "#808080",
    opacity: 0.6,
  },
  levelButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  levelButtonSubText: {
    fontSize: 12,
    color: "black",
    textAlign: "center",
  },
});