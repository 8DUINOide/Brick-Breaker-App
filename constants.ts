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
    speed: 75,
    courseCodes: [
      { code: "CIFP101", title: "Adnu Culture and Spirituality", units: 1.5 },
      { code: "CRCP001", title: "College SRA 1", units: 1.5 },
      { code: "ENGS101", title: "Purposive Communication", units: 3 },
      { code: "GEMT101", title: "Engineering Calculus 1: Differential Calculus", units: 3 },
      { code: "GESC111", title: "Chemistry for Engineers Lec", units: 3 },
      { code: "GESC112", title: "Chemistry for Engineers Lab", units: 1 },
      { code: "MTHS101", title: "Mathematics in the Modern World", units: 3 },
      { code: "PFIT101", title: "Physical Activities Toward Health and Fitness 1 (Pathfit 1): Movement Competency Training", units: 2 },
      { code: "PHIS101", title: "Understanding the Self", units: 3 },
      { code: "QCPP210", title: "Computer Engineering As A Discipline", units: 1 },
      { code: "QCPP310", title: "Programming Logic and Design", units: 2 },
      { code: "THEN100", title: "Introduction to the Catholic Faith", units: 3 },
    ],
    totalUnitsThisLevel: 27, // Sum of units in this level
    cumulativeTotalUnits: 27, // Cumulative total up to this level
  },
  {
    year: "First Year",
    semester: "2nd Semester",
    speed: 78,
    courseCodes: [
      { code: "CIFP102", title: "Adnu's Social Mission and Formation", units: 1.5 },
      { code: "CRCP002", title: "College SRA 2", units: 1.5 },
      { code: "GEMT102", title: "Engineering Calculus 2: Integral Calculus", units: 3 },
      { code: "GESC211", title: "Engineering Physics 1 Lec", units: 3 },
      { code: "GESC212", title: "Engineering Physics 1 Lab", units: 1 },
      { code: "NSCS101", title: "Science, Technology and Society", units: 3 },
      { code: "PFIT102", title: "Physical Activities Toward Health and Fitness II (Pathfit II): Exercise-Based Fitness Activities", units: 2 },
      { code: "PHIN101", title: "Logical and Critical Thinking", units: 3 },
      { code: "QCPP010", title: "Engineering Discrete Mathematics", units: 3 },
      { code: "QCPP320", title: "Object-Oriented Programming and Design", units: 2 },
      { code: "THEN101", title: "Christian Discipleship Today", units: 3 },
      { code: "       ", title: " ", units: 0 }, // Adjusted to match TOTAL_BRICKS
    ],
    totalUnitsThisLevel: 26,
    cumulativeTotalUnits: 53,
  },
  {
    year: "Second Year",
    semester: "1st Semester",
    speed: 95,
    courseCodes: [
      { code: "CRCP003", title: "College SRA 3", units: 1.5 },
      { code: "NSTP101", title: "National Service Training Program I - Cwts I", units: 3 },
      { code: "PHIN102", title: "Philosophical Anthropology", units: 3 },
      { code: "QCGE001", title: "Cpe Ge Elective 1", units: 3 },
      { code: "QCPA211", title: "Fundamentals of Electrical Circuits Lecture", units: 3 },
      { code: "QCPA212", title: "Fundamentals of Electrical Circuits Laboratory", units: 1 },
      { code: "QCPP330", title: "Data Structures and Algorithm Analysis", units: 2 },
      { code: "QECA030", title: "Environmental Science and Engineering", units: 3 },
      { code: "QECC101", title: "CAD 1: Fundamentals of CAD", units: 1 },
      { code: "QEMT103", title: "Differential Equations for ECE/CPE", units: 3 },
      { code: "SOCS101", title: "Art Appreciation", units: 3 },
      { code: "       ", title: "     ", units: 0 }, // Adjusted to match TOTAL_BRICKS
    ],
    totalUnitsThisLevel: 26.5,
    cumulativeTotalUnits: 79.5, // Adjusted cumulative total
  },
  {
    year: "Second Year",
    semester: "2nd Semester",
    speed: 100,
    courseCodes: [
      { code: "CRCP004", title: "College SRA 4", units: 1.5 },
      { code: "GEAL101", title: "Engineering Data Analysis", units: 3 },
      { code: "NSTP102", title: "National Service Training Program II - Cwts II", units: 3 },
      { code: "PHIS102", title: "Ethics", units: 3 },
      { code: "QCPA221", title: "Fundamentals of Electronic Circuits Lecture", units: 3 },
      { code: "QCPA222", title: "Fundamentals of Electronic Circuits Laboratory", units: 1 },
      { code: "QCPP020", title: "Numerical Methods and Analysis", units: 4 },
      { code: "QCPP340", title: "Software Design and Development", units: 4 },
      { code: "QCPP350", title: "Operating Systems Concepts and Development", units: 4 },
      { code: "       ", title: "     ", units: 0 }, // Adjusted to match TOTAL_BRICKS
      { code: "       ", title: "     ", units: 0 },
      { code: "       ", title: "     ", units: 0 },
    ],
    totalUnitsThisLevel: 26.5, // Adjusted for additional courses
    cumulativeTotalUnits: 106, // Adjusted cumulative total
  },
  {
    year: "Third Year",
    semester: "1st Semester",
    speed: 88,
    courseCodes: [
      { code: "QCCP220", title: "Cad 2: Computer Engineering Drafting and Design", units: 1 },
      { code: "QCEE001", title: "Cpe Professional Elective 1", units: 4 },
      { code: "QCPP411", title: "Logic Circuits and Design Lecture", units: 3 },
      { code: "QCPP412", title: "Logic Circuits and Design Laboratory", units: 1 },
      { code: "QCPP420", title: "Introduction to Feedback and Control Systems", units: 3 },
      { code: "QCPP430", title: "Fundamentals of Mixed Signals and Sensors", units: 3 },
      { code: "QECC010", title: "Engineering Technopreneurship", units: 3 },
      { code: "QECC210", title: "Methods of Research for Engineers", units: 3 },
      { code: "SOCS102", title: "Readings in Philippine History", units: 3 },
      { code: "THEN102", title: "Christian Moral Paradigm", units: 3 },
      { code: "       ", title: "     ", units: 0 },
      { code: "       ", title: "     ", units: 0 },
    ],
    totalUnitsThisLevel: 27, // Adjusted for additional courses
    cumulativeTotalUnits: 133, // Adjusted cumulative total
  },
  {
    year: "Third Year",
    semester: "2nd Semester",
    speed: 92,
    courseCodes: [
      { code: "GEAL102", title: "Engineering Economics", units: 3 },
      { code: "GEAL103", title: "Engineering Management", units: 2 },
      { code: "PHIN103", title: "Philosophy of Religion", units: 3 },
      { code: "QCEE002", title: "Cpe Professional Elective 2", units: 4 },
      { code: "QCPP230", title: "Basic Occupational Health and Safety", units: 3 },
      { code: "QCPP440", title: "Hdl Fundamentals", units: 1 },
      { code: "QCPP451", title: "Digital Signal Processing and Applications Lecture", units: 3 },
      { code: "QCPP452", title: "Digital Signal Processing and Applications Laboratory", units: 1 },
      { code: "QCPP511", title: "Microprocessors Fundamentals Lecture", units: 3 },
      { code: "QCPP512", title: "Microprocessors Fundamentals Laboratory", units: 1 },
      { code: "SOCS103", title: "Contemporary World", units: 3 },
      { code: "       ", title: "     ", units: 0 },
    ],
    totalUnitsThisLevel: 27,
    cumulativeTotalUnits: 160,
  },
  {
    year: "Fourth Year",
    semester: "1st Semester",
    speed: 82,
    courseCodes: [
      { code: "QCPP610", title: "Ojt/Industry Immersion for Cpe (240 Hours)", units: 2 },
      { code: "PFIT103", title: "Physical Activities Toward Health and Fitness 3 (Pathfit 3): Menu of Dance, Sports, Martial Arts, Group Exercise, Outdoor and Adventure Activities", units: 2, },
      { code: "QCCP460", title: "Data and Digital Communications", units: 3 },
      { code: "QCEE003", title: "Cpe Professional Elective 3", units: 4 },
      { code: "QCGE002", title: "Cpe Ge Elective 2", units: 3 },
      { code: "QCPP521", title: "Embedded System Lecture", units: 3 },
      { code: "QCPP522", title: "Embeded Systems Laboratory", units: 1 },
      { code: "QCPP530", title: "Computer Architecture and Organization", units: 4 },
      { code: "QCPP620", title: "Seminars and Fieldtrips for Cpe", units: 1 },
      { code: "QCPP630", title: "Cpe Practice and Design 1", units: 1 },
      { code: "       ", title: "     ", units: 0 },
      { code: "       ", title: "     ", units: 0 },
    ],
    totalUnitsThisLevel: 24,
    cumulativeTotalUnits: 184,
  },
  {
    year: "Fourth Year",
    semester: "2nd Semester",
    speed: 85,
    courseCodes: [
      { code: "GECC020", title: "Ece/Cpe Laws and Professional Practice", units: 3 },
      { code: "PFIT104", title: "Physical Activities Toward Health and Fitness 4 (Pathfit 4): Menu of Dance, Sports, Group Exercise, Outdoor and Adventure Activities", units: 2, },
      { code: "QCEE004", title: "Cpe Professional Elective 4", units: 4 },
      { code: "QCGE003", title: "Cpe Ge Elective 3", units: 3 },
      { code: "QCPP360", title: "Computer Networks and Security", units: 4 },
      { code: "QCPP640", title: "Cpe Practice and Design 2", units: 2 },
      { code: "QCPP650", title: "Emerging Technologies in Cpe", units: 3 },
      { code: "SOCS104", title: "The Life and Works of Rizal", units: 3 },
      { code: "THEN103", title: "Christian Vocation: Love, Family Life and Society", units: 3 },
      { code: "       ", title: "     ", units: 0 },
      { code: "       ", title: "     ", units: 0 },
      { code: "       ", title: "     ", units: 0 },
    ],
    totalUnitsThisLevel: 27,
    cumulativeTotalUnits: 211,
  },
];