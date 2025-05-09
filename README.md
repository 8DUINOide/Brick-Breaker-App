"# Brick-Breaker-App" 
Brick Breaker: Computer Engineering Curriculum

Brick Breaker is a mobile game built with React Native, inspired by the Computer Engineering curriculum at Ateneo de Naga University. Players progress through levels representing academic semesters, breaking bricks labeled with course codes to earn units and complete the curriculum. The game combines classic Brick Breaker mechanics with an educational theme, allowing players to track their progress via a "Credited Subjects" screen.

Features





Curriculum-Based Levels: Each level represents a semester (First Year to Fourth Year), with bricks symbolizing courses.



Unit Tracking: Earn academic units by breaking bricks, with cumulative totals displayed in-game and in the Credited Subjects screen.



Interactive Gameplay: Control a paddle with touch gestures to keep a ball in play and break bricks.



Multiple Screens:





Welcome Screen: Entry point with options to play, view instructions, or see credited subjects.



How to Play Screen: Detailed guide on game mechanics and objectives.



Play Menu: Select unlocked levels (semesters) to play.



Credited Subjects Screen: View completed courses, their codes, titles, and units.



Game Completed Screen: Celebrates finishing the curriculum with total units displayed.



Visual Feedback: Stars and text overlays ("LEVEL UP" or "TRY AGAIN") indicate level success or failure.



Responsive Design: Adapts to different screen sizes using dynamic dimensions.

Technologies Used





React Native: Cross-platform mobile app framework.



@shopify/react-native-skia: High-performance graphics rendering for game visuals.



react-native-reanimated: Animation and gesture handling for smooth paddle movement and ball physics.



react-native-gesture-handler: Touch-based paddle control.



TypeScript: Type-safe JavaScript for better code reliability.



Expo: Simplified development and testing workflow.

Prerequisites





Node.js (v16 or higher)



npm or yarn



Expo CLI: Install globally with npm install -g expo-cli



Git: For cloning the repository



A mobile device or emulator: For testing (iOS/Android via Expo Go or a simulator)

Installation



Clone the Repository:

git clone <repository-url>
cd BrickBreakerApp


Install Dependencies:

npm install

or

yarn install


Start the Development Server:

npx expo start


Scan the QR code with the Expo Go app on your mobile device, or run on an emulator with i (iOS) or a (Android).



Update App.tsx to include sound integration (see Future Improvements).

Gameplay Instructions





Objective: Break all bricks in each level (semester) to progress through the Computer Engineering curriculum, earning units toward the 211-unit goal.



Controls: Swipe left or right on the screen to move the paddle, keeping the ball in play to hit bricks.



Levels: Each level corresponds to a semester. Complete all bricks to advance; miss the ball to retry.



Units: Each brick represents a course with a unit value. Earn units by breaking bricks, tracked on the game screen and Credited Subjects screen.



Navigation:





Welcome Screen: Tap "Play" to select a level, "How to Play" for instructions, or "Credited Subjects" to view progress.



Play Menu: Choose an unlocked level (unlocked levels are based on progress).



Game Screen: Play the game; tap "Back" to return to the Welcome Screen.



Credited Subjects: View completed courses and units.



Game Completed: Appears after finishing all levels, with an option to restart.

For detailed instructions, refer to the "How to Play" screen in the app.

Project Structure





App.tsx: Main application file containing game logic, UI components, and navigation.



sample.ts: Game physics and animation logic (ball movement, collisions, etc.).



constants.ts: Game constants (dimensions, colors, level data, etc.).



types.ts: TypeScript interfaces for game objects (ball, paddle, bricks).



shader.ts: Shader code for background visuals.



assets/sounds/: Directory for sound files (to be added manually).

Troubleshooting





Dependencies Fail to Install:





Clear the npm cache: npm cache clean --force



Delete node_modules and package-lock.json, then run npm install again.



Expo Server Not Starting:





Ensure no other process is using port 19000.



Run npx expo start --clear to reset the cache.



Graphics Not Rendering:





Verify @shopify/react-native-skia is correctly installed.



Check for TypeScript errors in App.tsx related to Skia components.



Future Improvements



Progress Persistence: Save completed levels and total units to local storage (e.g., AsyncStorage) to retain progress across sessions.



Difficulty Scaling: Increase ball speed or add obstacles as levels progress.



Visual Enhancements: Add particle effects for brick destruction or animations for level transitions.



Accessibility: Include a sound toggle and high-contrast mode for better accessibility.

License

This project is licensed under the MIT License. See the LICENSE file for details.

Credits


Inspired by: The Computer Engineering curriculum at Ateneo de Naga University.


Developed by: Al Francis B. Paz

Happy breaking bricks and completing your virtual degree!