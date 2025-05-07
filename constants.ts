import { Dimensions } from "react-native";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

export const BALL_COLOR = "#77FF23";

export const TOTAL_BRICKS = 12;
export const BRICK_ROW_LENGTH = 3;
export const PADDLE_HEIGHT = 50;
export const PADDLE_WIDTH = 125;
export const BRICK_HEIGHT = 25;
export const BRICK_WIDTH = 80;
export const BRICK_MIDDLE = windowWidth / 2 - BRICK_WIDTH / 2;
export const PADDLE_MIDDLE = windowWidth / 2 - PADDLE_WIDTH / 2;
export const RADIUS = 16;
export const MAX_SPEED = 50;

export const height = windowHeight;
export const width = windowWidth;

// Course codes for the bricks
export const COURSE_CODES = [
  "CIFP101", "GESC111", "PHIS101",
  "CRCP001", "GESC112", "QCPP210",
  "ENGS101", "MTHS101", "QCPP310",
  "GEMT101", "PFFI01", "THEN100",
];