import { Dimensions } from "react-native";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

export const BALL_COLOR = "#77FF23";

export const TOTAL_BRICKS = 12;
export const BRICK_ROW_LENGTH = 3;
export const PADDLE_HEIGHT = 50;
export const PADDLE_WIDTH = 125;
export const BRICK_HEIGHT = 32;
export const BRICK_WIDTH = 90;
export const BRICK_MIDDLE = windowWidth / 2 - BRICK_WIDTH / 2;
export const PADDLE_MIDDLE = windowWidth / 2 - PADDLE_WIDTH / 2;
export const RADIUS = 16;
export const MAX_SPEED = 50;

export const height = windowHeight;
export const width = windowWidth;

// Level configurations for Computer Engineering Curriculum with units and total units
export const LEVELS = [
  {
    year: "First Year",
    semester: "1st Semester",
    courseCodes: [
      { code: "CIFP101", units: 1.5 },
      { code: "CRCP001", units: 1.5 },
      { code: "ENGS101", units: 3 },
      { code: "GEMT101", units: 3 },
      { code: "GESC111", units: 3 },
      { code: "GESC112", units: 1 },
      { code: "MTHS101", units: 3 },
      { code: "PFIT101", units: 2 },
      { code: "PHIS101", units: 3 },
      { code: "QCPP210", units: 1 },
      { code: "QCPP310", units: 2 },
      { code: "THEN100", units: 3 },
    ],
    totalUnitsThisLevel: 27, // Sum of units in this level
    cumulativeTotalUnits: 27, // Cumulative total up to this level
  },
  {
    year: "First Year",
    semester: "2nd Semester",
    courseCodes: [
      { code: "CIFP102", units: 1.5 },
      { code: "CRCP002", units: 1.5 },
      { code: "GEMT101", units: 3 },
      { code: "GESC211", units: 3 },
      { code: "GESC212", units: 1 },
      { code: "NSCS101", units: 3 },
      { code: "PFIT102", units: 2 },
      { code: "PHIN101", units: 3 },
      { code: "QCPP010", units: 3 },
      { code: "QCPP320", units: 2 },
      { code: "THEN101", units: 3 },
      { code: "       ", units: 0 }, // Adjusted to match TOTAL_BRICKS
    ],
    totalUnitsThisLevel: 26,
    cumulativeTotalUnits: 53,
  },
  {
    year: "Second Year",
    semester: "1st Semester",
    courseCodes: [
      { code: "CRCP003", units: 1.5 },
      { code: "NSTP101", units: 3 },
      { code: "PHIN102", units: 3 },
      { code: "QCGE001", units: 3 },
      { code: "QCPA211", units: 3 },
      { code: "QCPA212", units: 1 },
      { code: "QCPP330", units: 2 },
      { code: "QECA030", units: 3 },
      { code: "QECC101", units: 1 },
      { code: "QEMT103", units: 3 },
      { code: "SOCS101", units: 3 },
      { code: "       ", units: 0 }, // Adjusted to match TOTAL_BRICKS
    ],
    totalUnitsThisLevel: 26.5,
    cumulativeTotalUnits: 79.5, // Adjusted cumulative total
  },
  {
    year: "Second Year",
    semester: "2nd Semester",
    courseCodes: [
      { code: "CRCP004", units: 1.5 },
      { code: "GEAL101", units: 3 },
      { code: "NSTP102", units: 3 },
      { code: "PHIS102", units: 3 },
      { code: "QCPA221", units: 3 },
      { code: "QCPA222", units: 1 },
      { code: "QCPP020", units: 4 },
      { code: "QCPP340", units: 4 },
      { code: "QCPP350", units: 4 },
      { code: "       ", units: 0 }, // Adjusted to match TOTAL_BRICKS
      { code: "       ", units: 0 },
      { code: "       ", units: 0 },
    ],
    totalUnitsThisLevel: 26.5, // Adjusted for additional courses
    cumulativeTotalUnits: 106, // Adjusted cumulative total
  },
  {
    year: "Third Year",
    semester: "1st Semester",
    courseCodes: [
      { code: "QCCP220", units: 1 },
      { code: "QCEE001", units: 4 },
      { code: "QCPP411", units: 3 },
      { code: "QCPP412", units: 1 },
      { code: "QCPP420", units: 3 },
      { code: "QCPP430", units: 3 },
      { code: "QECC010", units: 3 },
      { code: "QECC210", units: 3 },
      { code: "SOCS102", units: 3 },
      { code: "THEN102", units: 3 },
      { code: "       ", units: 0},
      { code: "       ", units: 0 },
    ],
    totalUnitsThisLevel: 27, // Adjusted for additional courses
    cumulativeTotalUnits: 133, // Adjusted cumulative total
  },
  {
    year: "Third Year",
    semester: "2nd Semester",
    courseCodes: [
      { code: "GEAL102", units: 3 },
      { code: "GEAL103", units: 2 },
      { code: "PHIN103", units: 3 },
      { code: "QCEE002", units: 4 },
      { code: "QCPP230", units: 3 },
      { code: "QCPP440", units: 1 },
      { code: "QCPP451", units: 3 },
      { code: "QCPP452", units: 1 },
      { code: "QCPP511", units: 3 },
      { code: "QCPP512", units: 1 },
      { code: "SOCS103", units: 3 },
      { code: "       ", units: 0 },
    ],
    totalUnitsThisLevel: 27,
    cumulativeTotalUnits: 160,
  },
  {
    year: "Fourth Year",
    semester: "1st Semester",
    courseCodes: [
      { code: "QCPP610", units: 2 },
      { code: "PFIT103", units: 2 },
      { code: "QCCP460", units: 3 },
      { code: "QCEE003", units: 4 },
      { code: "QCGE002", units: 3 },
      { code: "QCPP521", units: 3 },
      { code: "QCPP522", units: 1 },
      { code: "QCPP530", units: 4 },
      { code: "QCPP620", units: 1 },
      { code: "QCPP630", units: 1 },
      { code: "       ", units: 0 },
      { code: "       ", units: 0 },
    ],
    totalUnitsThisLevel: 24,
    cumulativeTotalUnits: 184,
  },
  {
    year: "Fourth Year",
    semester: "2nd Semester",
    courseCodes: [
      { code: "GECC020", units: 3 },
      { code: "PFIT104", units: 2 },
      { code: "QCEE004", units: 4 },
      { code: "QCGE003", units: 3 },
      { code: "QCPP360", units: 4 },
      { code: "QCPP640", units: 2 },
      { code: "QCPP650", units: 3 },
      { code: "SOCS104", units: 3 },
      { code: "THEN103", units: 3 },
      { code: "       ", units: 0 },
      { code: "       ", units: 0 },
      { code: "       ", units: 0 },
    ],
    totalUnitsThisLevel: 27,
    cumulativeTotalUnits: 211,
  },
];