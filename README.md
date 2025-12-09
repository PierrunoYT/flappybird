# 🐦 Flappy Bird

A classic Flappy Bird game clone built with HTML5 Canvas, CSS, and vanilla JavaScript.

## 🎮 Play Now

**[Play Flappy Bird](https://pierrunoyt.github.io/flappybird/)**

## 🕹️ How to Play

- **Click** or press **Spacebar** to make the bird flap
- Navigate through the pipes without hitting them
- Each pipe passed scores 1 point
- Try to beat your high score!

## ✨ Features

- Smooth physics-based gameplay
- Animated bird with flapping wings
- Parallax scrolling clouds
- Particle effects on flap
- High score saved locally
- Retro pixel art aesthetic
- **Fully responsive design** with adaptive layouts for:
  - Mobile devices (portrait & landscape)
  - Tablets
  - Desktop screens
  - Ultra-wide displays
- Dynamic difficulty adjustments based on screen size
- High DPI screen optimizations for crisp rendering
- Orientation detection and automatic layout adjustments

## 🛠️ Tech Stack

- HTML5 Canvas
- CSS3
- Vanilla JavaScript
- Google Fonts (Press Start 2P)

## 📁 Project Structure

```
flappybird/
├── index.html               # Main HTML file
├── styles.css               # CSS styles with responsive media queries
├── game.js                  # Game logic with adaptive difficulty
├── responsive_test.js       # Responsive behavior testing suite
├── test_responsiveness.html # Testing interface for responsive features
├── LICENSE                  # MIT License
└── README.md                # This file
```

## 🚀 Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/PierrunoYT/flappybird.git
   ```

2. Open `index.html` in your browser, or serve with a local server:
   ```bash
   cd flappybird
   python -m http.server 8080
   ```

3. Navigate to `http://localhost:8080`

## 🧪 Testing Responsive Design

The project includes testing resources for responsive behavior:

### Test Documentation

**View Test Reference:**
1. Open `test_responsiveness.html` in your browser (or navigate to `http://localhost:8080/test_responsiveness.html` if using a local server)
2. This page documents the responsive design improvements and expected behavior for different screen sizes

**Manual Testing:**
To manually test responsive behavior:
1. Open `index.html` (the main game)
2. Use your browser's Developer Tools (F12)
3. Toggle Device Toolbar (Ctrl+Shift+M / Cmd+Shift+M)
4. Test different device presets (iPhone, iPad, Desktop, etc.)
5. Try both portrait and landscape orientations
6. Observe how the game adapts:
   - Canvas size adjusts automatically
   - UI elements reposition based on screen size
   - Game difficulty changes (pipe gaps, speed)
   - Touch/click controls work appropriately

**Console Testing:**
The `responsive_test.js` file contains test utilities. To use it:
1. Open the browser console (F12)
2. Load the script in your game page
3. Check console output for media query matches and responsive function tests

### Expected Behavior by Screen Size

- **Mobile Portrait (< 768px)**: Compact layout, simplified UI, easier difficulty
- **Mobile Landscape**: Horizontal layout, absolute positioning for score
- **Tablet (768px - 1024px)**: Balanced layout, medium difficulty
- **Desktop (1024px+)**: Full UI, larger canvas, standard difficulty
- **Ultra-wide (> 1920px)**: Centered content, maximum difficulty

## 📱 Responsive Design

The game automatically adapts to different screen sizes:

- **Mobile (< 768px)**: Optimized touch controls, simplified UI
- **Tablet (768px - 1024px)**: Balanced layout with medium difficulty
- **Desktop (1024px - 1920px)**: Full-featured experience
- **Ultra-wide (> 1920px)**: Enhanced visuals with maximum difficulty

Game difficulty (pipe gap size, speed) adjusts dynamically based on screen size for optimal gameplay experience.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**PierrunoYT**

- GitHub: [@PierrunoYT](https://github.com/PierrunoYT)

