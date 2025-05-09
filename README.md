

Brick Breaker: CpE Curriculum

A Brick Breaker game inspired by the Computer Engineering curriculum at Ateneo de Naga University

This Brick Breaker game, developed for the Mobile App Development course at Ateneo de Naga University, transforms the classic arcade game into an educational journey. Players break bricks representing Computer Engineering courses, earn academic units, and progress through semesters to "graduate" with 211 units.


Report bug · Request feature





Table of Contents





Installation



Status



What's Included



Bugs and Feature Requests



Contributing



Creators



Thanks



Copyright and License

Installation

Prerequisites

Ensure you have the following installed:





Node.js (v16 or higher)



npm or yarn



Expo CLI: npm install -g expo-cli



Git: For cloning the repository



A mobile device or emulator: For testing via Expo Go (iOS/Android) or simulators

Steps





Clone the Repository:

git clone https://gitlab.com/your-repo/brick-breaker.git
cd brick-breaker



Install Dependencies:

npm install

or

yarn install



Start the Development Server:

npx expo start





Scan the QR code with the Expo Go app, or press i (iOS simulator) or a (Android emulator).

Technology Stack





React Native: Cross-platform mobile app framework



@shopify/react-native-skia: High-performance graphics rendering



react-native-reanimated: Smooth animations and physics



react-native-gesture-handler: Touch-based paddle controls



TypeScript: Type-safe development



Expo: Streamlined development and testing

Resources & References





React Native Documentation



Expo Documentation



@shopify/react-native-skia



react-native-reanimated

Status







Activity



Status



Date





Project Setup



✅ Completed



March 2025





UI Design



✅ Completed



March 2025





Game Physics



✅ Completed



April 2025





Final Testing



⏳ Pending



May 2025

What's Included





🎮 Curriculum-Based Gameplay: Break bricks labeled with course codes (e.g., CpE101) to progress through semesters (First Year to Fourth Year).



📚 Unit Tracking: Earn units per course, displayed on the game screen and Credited Subjects screen, culminating in 211 units for "graduation."



🖼️ Interactive UI:





Welcome Screen: Start, view instructions, or check progress.



How to Play Screen: Detailed gameplay guide.



Play Menu: Select unlocked semesters.



Credited Subjects Screen: View completed courses, codes, titles, and units.



Game Completed Screen: Celebrate curriculum completion.



⭐ Visual Feedback: Stars and messages ("LEVEL UP" or "TRY AGAIN") for level outcomes.



📱 Responsive Design: Adapts to various screen sizes.

Directory Structure

src/
├── constants.ts         # Game constants (dimensions, colors, levels)
├── sample.ts            # Physics and animation logic
├── shader.ts            # Background shader code
├── types.ts             # TypeScript interfaces
├── App.tsx              # Main app component
README.md

Gameplay Instructions





Objective: Break all bricks (courses) in each level (semester) to earn units and complete the Computer Engineering curriculum.



Controls: Swipe left/right to move the paddle, keeping the ball in play to hit bricks.



Progression: Clear all bricks to advance; miss the ball to retry.



Units: Each brick has a unit value. Track progress on the game screen or Credited Subjects screen.



Navigation:





Welcome Screen: Tap "Play", "How to Play", or "Credited Subjects".



Play Menu: Choose unlocked levels.



Game Screen: Play and tap "Back" to exit.



Credited Subjects: Review completed courses.



Game Completed: Celebrate earning 211 units.

See the in-game "How to Play" screen for details.

Bugs and Feature Requests

Found a bug or have a feature idea? Check the issue guidelines and search existing/closed issues. If your issue is new, open a new issue.

Contributing

Read our contributing guidelines for details on opening issues, coding standards, and development.

Code should adhere to the Code Guide. Editor preferences are in the editor config. Learn more at https://editorconfig.org/.

Creators





Developer: [Your Name] ([https://gitlab.com/your-username])



Institution: Ateneo de Naga University, Computer Engineering Department

Thanks

Special thanks to:





Ateneo de Naga University CpE Department for the curriculum inspiration 🎓



Mobile App Development Instructors for guidance 📚



Open-Source Community for libraries like React Native and Skia 🚀

Copyright and License

Code and documentation copyright 2025 the authors. Code released under the MIT License.

Enjoy breaking bricks and earning your virtual degree! 🎮