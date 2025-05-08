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

// Level configurations for Computer Engineering Curriculum
export const LEVELS = [
  {
    year: "First Year",
    semester: "Semester 1",
    courseCodes: [
      "CIFP101", "GESC111", "PHIS101",
      "CRCP001", "GESC112", "QCPP210",
      "ENGS101", "MTHS101", "QCPP310",
      "GEMT101", "PFIT101", "THEN100",
    ],
  },
  {
    year: "First Year",
    semester: "Semester 2",
    courseCodes: [
      "CIFP102", "QCPP320", "QCPP010",
      "CRCP002", "THEN101", "PHIN101",
      "GEMT102", "GEMT101", "PFIT102",
      "GESC211", "GESC212", "NSCS101",
    ],
  },
  {
    year: "Second Year",
    semester: "Semester 1",
    courseCodes: [
      "CRCP003", "NSTP101", "PHIN102",
      "CRCP001", "QECC101", "QCGE001",
      "GEMT102", "QECA030", "QCPA211",
      "QEMT103", "QCPP330", "QCPA212",
    ],
  },
  {
    year: "Second Year",
    semester: "Semester 2",
    courseCodes: [
      "CRCP004", "QCPA211", "QCPP350",
      "GEAL101", "QCPA212", "QCPP340",
      "NSTP102", "QEMT103", "QCPP020",
      "PHIS102", "QCPA221", "QCPA222",
    ],
  },
  {
    year: "Third Year",
    semester: "Semester 1",
    courseCodes: [
      "QCCP220", "QCPP420", "SOCS102",
      "QCEE001", "QCPP430", "THEN102",
      "QCPP411", "QECC010", "QCPA211",
      "QCPP412", "QECC210", "QCPA212",
    ],
  },
  {
    year: "Third Year",
    semester: "Semester 2",
    courseCodes: [
      "GEAL102", "QCPP230", "QCPP511",
      "GEAL103", "QCPP440", "QCPP512",
      "PHIN103", "QCPP451", "SOCS103",
      "QCEE002", "QCPP452", "QCPA222",
    ],
  },
  {
    year: "Fourth Year",
    semester: "Semester 1",
    courseCodes: [
      "GEAL102", "QCPP630", "QCPP511",
      "QCPP522", "QCPP530", "QCPP620",
      "QCPP521", "QCPP521", "QCGE002",
      "PFIT103", "QCCP460", "QCEE003",
    ],
  },
  {
    year: "Fourth Year",
    semester: "Semester 2",
    courseCodes: [
      "GECC020", "QCPP360", "QCPP521",
      "PFIT104", "QCPP640", "THEN103",
      "QCEE004", "QCPP650", "QCPA211",
      "QCGE003", "SOCS104", "QCPP610",
    ],
  },
];