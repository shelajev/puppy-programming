# 🐶 Puppy Programming Game

A fun, visual programming game where you help a cute puppy collect food by creating programs using drag-and-drop instructions!

## 🎮 How to Play

### Objective
Guide the puppy around the 5×5 game board to collect all the food items (🦴) while avoiding obstacles (🧱).

### Game Components

#### Instructions Palette
Drag these commands from the left panel to create your program:
- **⬆ Forward** - Move the puppy one step forward in the current direction
- **↺ Turn Left** - Rotate the puppy 90° counterclockwise  
- **↻ Turn Right** - Rotate the puppy 90° clockwise
- **🦘 Jump** - Jump over obstacles (moves 2 steps forward)

#### Multipliers
Use these green square tiles to repeat actions:
- **×1, ×2, ×3, ×4, ×5** - Drag onto any instruction to repeat it multiple times
- Dragging a new multiplier replaces the existing one
- Instructions show "×N" when they have a multiplier applied

#### Your Program
- Drop instructions into the program area to build your sequence
- Drag instructions within the program to reorder them
- Click the **×** button to remove individual instructions
- Watch the puppy follow your program step by step!

### Controls
- **▶ Run Program** - Execute your instruction sequence
- **🔄 Reset** - Reset the game board and clear your program  
- **🗑 Clear Program** - Remove all instructions from your program

### Game Features

#### Direction Indicator
The puppy shows its current facing direction with an arrow:
- ⬆️🐶 - Facing North
- ➡️🐶 - Facing East  
- ⬇️🐶 - Facing South
- ⬅️🐶 - Facing West

#### Randomized Levels
Each game generates a unique level layout:
- **Seed-based generation** - Share levels by copying the URL
- **URL parameters** - Add `?seed=12345` to play a specific level
- **Automatic seed display** - Current seed shown in the game status

#### Visual Feedback
- **Executing instructions** glow and pulse during program execution
- **Multiplier targeting** shows green borders when dragging multipliers
- **Food collection** displays success messages and updates counters
- **Collision detection** prevents moving through obstacles

## 🚀 Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Node.js (for TypeScript compilation)

### Installation
1. Clone or download the game files
2. Open `index.html` in your web browser
3. Start programming your puppy!

### Development
```bash
# Compile TypeScript (if making changes)
npx tsc game.ts --lib es2015,dom
```

## 🎯 Game Mechanics

### Movement System
- Puppy starts at position (0,0) facing North
- Forward moves in the current facing direction
- Jump moves 2 steps forward, useful for obstacles
- Invalid moves (hitting walls/obstacles) show error messages

### Level Generation
- 5×5 grid with randomized obstacle and food placement
- 2-6 obstacles (up to 25% of board)
- 3-7 food items (up to 30% of board)
- Starting position (0,0) always kept clear
- Deterministic generation based on URL seed parameter

### Program Execution
- Instructions execute sequentially with visual feedback
- Multipliers repeat the same action multiple times
- 400ms delay between repeated actions
- 800ms delay between different instructions
- Program stops if puppy gets stuck or completes successfully

## 🏆 Tips for Success

1. **Plan your route** - Study the board layout before programming
2. **Use multipliers** - Reduce program length with ×2, ×3, etc.
3. **Mind the direction** - Remember which way the puppy is facing
4. **Jump obstacles** - Use the jump command to skip over barriers
5. **Share levels** - Copy the URL to share interesting level seeds

## 🛠 Technical Details

- **Frontend**: HTML5, CSS3, TypeScript
- **Drag & Drop**: Native HTML5 drag and drop API
- **Animations**: CSS transitions and keyframe animations
- **Grid System**: CSS Grid for responsive 5×5 game board
- **Random Generation**: Seeded linear congruential generator
- **URL Routing**: URLSearchParams for seed management

Enjoy programming your puppy! 🐕✨