# Velocity - Typing Tutor

![Typing Tutor](https://img.shields.io/badge/typing-tutor-cyan?style=flat-square&logo=keyboard)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)
![Single File](https://img.shields.io/badge/single-file-blue?style=flat-square)
![No Dependencies](https://img.shields.io/badge/dependencies-0-red?style=flat-square)

A sleek, lightweight typing speed and accuracy trainer that works on any device without installation. Perfect for improving your typing skills with real-time feedback and detailed statistics.

---

## 📸 Features

### 🎯 Core Features
- **Zero Installation** - Single HTML file, works in any modern browser
- **Three Difficulty Levels** - Easy, Medium, and Hard modes
- **Real-Time Statistics** - Live WPM, accuracy, and error tracking
- **Progress Tracking** - Automatically saves test history to local storage
- **Beautiful Dark Theme** - Modern, distraction-free interface
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **PWA Support** - Can be installed as an offline app
- **Chromebook Friendly** - Perfect for Chromebooks and any browser environment

### 📊 Statistics & Tracking
- **WPM (Words Per Minute)** - Real-time speed calculation
- **Accuracy Percentage** - Character-by-character accuracy tracking
- **Error Count** - Total mistakes during typing
- **Time Elapsed** - Duration of each test session
- **Best WPM** - Your personal best performance
- **Average WPM** - Average performance across all tests
- **Test History** - Complete record of all completed tests

### 🎨 User Experience
- Smooth animations and transitions
- Character-by-character highlighting (correct/incorrect/current)
- Auto-scrolling reference text
- Real-time live stats updates
- Results modal with detailed performance metrics
- Statistics dashboard for progress tracking
- Clean, minimalist interface design

---

## 🚀 Getting Started

### Quick Start (Fastest Way)

1. **Download** `index.html`
2. **Double-click** to open in your browser
3. **Start typing!**

That's it! No installation, no setup, no dependencies.

### Option 1: Direct Usage

```bash
# Clone the repository
git clone https://github.com/yourusername/typing-tutor.git

# Navigate to the directory
cd typing-tutor

# Open in your browser
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

### Option 2: GitHub Pages (Live Demo)

Visit the live demo: **https://yourusername.github.io/typing-tutor/**

### Option 3: Install as App (Chromebooks & PWA)

1. Open `index.html` in Chrome or Edge
2. Click the install icon (⊕) in the address bar
3. Click "Install"
4. Launch from your app drawer or home screen

---

## 📖 How to Use

### Starting a Test

1. **Click "Start New Test"** button to load random practice text
2. **Select Difficulty Level** from the dropdown (Easy, Medium, Hard)
3. **Click in the input field** to begin typing
4. **Type the reference text** exactly as shown
5. **Watch your stats** update in real-time

### Understanding Your Stats

| Stat | Description | Unit |
|------|-------------|------|
| **WPM** | Words typed per minute | words/minute |
| **Accuracy** | Percentage of correct characters | % |
| **Errors** | Total number of mistakes | count |
| **Time** | Duration of your test | seconds |

### Navigation

- **Practice Mode** - Main typing practice interface
- **Stats Mode** - View your complete statistics and progress
- **Difficulty Selector** - Choose Easy, Medium, or Hard
- **Reset Button** - Clear current attempt and start over
- **Start New Test** - Load new text and reset counters

### Managing Statistics

- Statistics are **automatically saved** to your browser
- View all stats in the **Stats tab**
- **Clear Statistics** button resets your history
- Data persists even if you close the browser

---

## 🎓 Difficulty Levels Explained

### Easy Mode
- **Content**: Common English words and simple sentences
- **Use Case**: Beginners, building confidence and basics
- **Focus**: Getting comfortable with the interface
- **Sample**: "The quick brown fox jumps over the lazy dog."

### Medium Mode
- **Content**: Mixed paragraphs with realistic text
- **Use Case**: Intermediate users, building speed and accuracy
- **Focus**: Improving consistency and performance
- **Sample**: "In the realm of software development, clean code is paramount..."

### Hard Mode
- **Content**: Code snippets with symbols and special characters
- **Use Case**: Advanced users, technical typing practice
- **Focus**: Handling special characters and complex text
- **Sample**: `const fibonacci = (n) => n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2);`

---

## 🎯 Tips for Better Results

### Accuracy First
- Focus on typing correctly rather than typing fast
- Speed naturally increases with accuracy
- Aim for 95%+ accuracy before worrying about WPM

### Consistent Practice
- Practice regularly for best results
- Start with Easy, progress to Medium then Hard
- Track your improvement using the Stats tab

### Posture and Setup
- Sit with proper posture
- Keep your screen at eye level
- Use an external keyboard if possible
- Ensure adequate lighting

### Progressive Learning
1. Master Easy level (targeting 60+ WPM, 98%+ accuracy)
2. Move to Medium level (targeting 80+ WPM, 98%+ accuracy)
3. Challenge Hard level (targeting 100+ WPM, 95%+ accuracy)

### Tracking Progress
- Check the Stats tab regularly
- Compare your Best WPM and Average WPM
- Notice improvements over time
- Celebrate milestones and personal records

---

## 💻 Technical Details

### Technology Stack
- **HTML5** - Structure and semantic markup
- **CSS3** - Modern styling with CSS variables
- **Vanilla JavaScript** - No frameworks or libraries needed
- **Web Storage API** - Local persistence of statistics
- **Service Worker** - Offline support and PWA capabilities

### Browser Compatibility
| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Recommended, best experience |
| Edge | ✅ Full | Chromium-based, full support |
| Firefox | ✅ Full | Latest versions supported |
| Safari | ✅ Full | macOS and iOS versions |
| Opera | ✅ Full | Chromium-based engine |
| Chromebook | ✅ Full | Native support, works great |

**Minimum Requirements:**
- Modern browser (ES6 JavaScript support)
- Local storage enabled
- JavaScript enabled

### Performance
- **File Size**: ~60 KB (uncompressed, single file)
- **Load Time**: < 1 second
- **Memory Usage**: Minimal (~5 MB during use)
- **Offline Support**: Yes, via Service Worker
- **No External CDN Calls**: All assets embedded

### Data Storage
- **Location**: Browser's Local Storage
- **Capacity**: Typically 5-10 MB per domain
- **Privacy**: Data stays on your device
- **Persistence**: Data survives browser restarts
- **Clearing**: Manual deletion only (via Clear Statistics button)

---

## 🔒 Privacy & Security

### What Data is Collected?
✅ **Only Your Test Statistics**
- Your WPM scores
- Accuracy percentages
- Error counts
- Test timestamps
- Nothing else

### Where is Data Stored?
📍 **Local Storage (Your Device Only)**
- Data is stored in your browser
- Never sent to any server
- Never shared with third parties
- Completely under your control

### What About Tracking?
❌ **No Tracking at All**
- No analytics
- No cookies
- No advertisements
- No user tracking
- No data collection

### Security Features
- ✅ No external dependencies (no supply chain risk)
- ✅ No network requests (except initial load)
- ✅ No user registration required
- ✅ No password or personal information needed
- ✅ Source code is transparent and auditable

---

## 📱 Device Support

### Desktop
- Windows (7, 10, 11+)
- macOS (10.12+)
- Linux (any distribution)

### Mobile
- iOS (Safari, Chrome)
- Android (Chrome, Firefox, Samsung Internet)
- iPadOS (iPad with Safari or Chrome)

### Chromebook
- All Chromebook models
- Full offline support with PWA
- Can be installed as app
- Works with or without internet

### Installation on Different Devices

**Windows/Mac:**
1. Download index.html
2. Double-click the file
3. Opens in default browser

**Chromebook:**
1. Open index.html in Chrome
2. Click the ⊕ icon in address bar
3. Select "Install"
4. Launch from app drawer

**Mobile (iOS):**
1. Open in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. Tap "Add"

**Mobile (Android):**
1. Open in Chrome
2. Tap menu (three dots)
3. Select "Install app"
4. Tap "Install"

---

## 🎨 Customization

### Modify Text Samples

Edit the `textSamples` object in the JavaScript section:

```javascript
const textSamples = {
    easy: [
        "Your custom text here...",
        "Another sentence...",
    ],
    medium: [
        "Your medium difficulty text...",
    ],
    hard: [
        "Your hard text with special chars...",
    ]
};
```

### Change Colors

Modify CSS variables in the `<style>` section:

```css
:root {
    --accent: #06b6d4;           /* Main color */
    --bg-primary: #0f172a;       /* Background */
    --text-primary: #f1f5f9;     /* Text color */
    /* ... other variables ... */
}
```

### Adjust Fonts

Update font imports in the `<style>` section:

```html
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@400;600&display=swap');
```

---

## 🔧 For Developers

### Project Structure
```
typing-tutor/
├── index.html          # Single file application
├── README.md           # This file
├── LICENSE             # MIT License
└── .gitignore          # Git configuration
```

### Code Quality
- Single file makes it easy to understand
- Well-commented code
- Clean, readable JavaScript
- Modern CSS with variables
- Semantic HTML5

### No Dependencies
- Pure HTML/CSS/JavaScript
- No npm packages required
- No build process needed
- No development environment setup

### Contributing
Want to improve the typing tutor?

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add improvement'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Open a Pull Request

---

## 🐛 Troubleshooting

### Buttons Not Responding?
- **Solution**: Refresh the page (Ctrl+R or Cmd+R)
- **Alternative**: Clear browser cache and try again
- **Last Resort**: Try a different browser

### Stats Not Saving?
- **Check**: Is local storage enabled in browser settings?
- **Solution**: Enable local storage in browser privacy settings
- **Alternative**: Try a different browser that supports local storage

### Text Not Displaying?
- **Solution**: Update your browser to the latest version
- **Check**: Ensure JavaScript is enabled
- **Alternative**: Use a different modern browser

### Can't Install as App?
- **Chrome/Edge**: Click the ⊕ icon in address bar
- **Safari**: Use "Add to Home Screen" from Share menu
- **Android**: Use "Install app" from Chrome menu

### Performance Issues?
- **Solution**: Close other browser tabs
- **Check**: Ensure sufficient RAM available
- **Try**: Using a different browser engine

---

## 📊 Statistics Storage Explanation

### How Statistics Work
1. **Local Storage** - Browser saves stats automatically
2. **Persistent** - Data survives browser restart
3. **Private** - Data never leaves your device
4. **Exportable** - Can be copied from browser console

### Viewing Statistics in Browser Console
```javascript
// In browser console (F12):
localStorage.getItem('typingTutorStats')
```

### Clearing Statistics
- Use the "Clear Statistics" button in Stats tab
- Or clear browser data (Settings → Privacy)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ You can use this freely
- ✅ You can modify it
- ✅ You can distribute it
- ✅ You can use it commercially
- ⚠️ You must include the license
- ⚠️ No warranty provided

---

## 🤝 Contributing

Contributions are welcome! Here are some ways you can help:

### Report Bugs
- Use the GitHub Issues tab
- Describe the problem clearly
- Include browser and OS information
- Provide steps to reproduce

### Suggest Features
- Open a GitHub Issue
- Explain the use case
- Describe the expected behavior
- Provide examples if possible

### Submit Pull Requests
- Fork the repository
- Create a feature branch
- Make your improvements
- Write clear commit messages
- Submit a PR with description

### Ideas for Improvements
- Additional text samples for different languages
- Custom text upload feature
- Keyboard layout detection
- Multiple language support
- Advanced statistics charts
- Multiplayer mode
- Sound effects and haptic feedback

---

## 📞 Support & Help

### Common Questions

**Q: Is my data secure?**
A: Yes! All data stays on your device in local storage. Nothing is transmitted anywhere.

**Q: Can I use this offline?**
A: Yes! The app works completely offline thanks to Service Worker support.

**Q: How do I backup my statistics?**
A: Open browser console and copy the output of `localStorage.getItem('typingTutorStats')`

**Q: Can I use this on multiple devices?**
A: Yes, but statistics are stored locally per device. You'd need to manually sync.

**Q: Is it free?**
A: Completely free and open source under MIT License.

### Getting Help
1. Check the Troubleshooting section above
2. Review the GitHub Issues
3. Check browser console (F12) for errors
4. Try a different browser
5. Open a GitHub Issue for support

---

## 📈 Roadmap

### Current Version
- ✅ Core typing practice functionality
- ✅ Three difficulty levels
- ✅ Real-time statistics
- ✅ Local progress tracking
- ✅ Responsive design
- ✅ Dark theme

### Potential Future Features
- [ ] Multiple language support
- [ ] Custom text upload
- [ ] Advanced statistics and graphs
- [ ] Keyboard layout detection
- [ ] Multiplayer mode
- [ ] Achievements and badges
- [ ] Sound effects
- [ ] Different themes
- [ ] Mobile app (React Native)
- [ ] Web Worker for performance

---

## 🎉 Acknowledgments

This typing tutor was created with attention to:
- User experience and simplicity
- Clean, maintainable code
- Privacy-first approach
- No unnecessary dependencies
- Cross-platform compatibility
- Accessibility standards

---

## 📝 Version History

### v1.0.0 (Current)
- Initial release
- Core typing practice functionality
- Three difficulty levels
- Statistics tracking
- PWA support
- Responsive design

---

## 🔗 Links

- **Repository**: https://github.com/yourusername/typing-tutor
- **Live Demo**: https://yourusername.github.io/typing-tutor
- **Issues**: https://github.com/yourusername/typing-tutor/issues
- **License**: [MIT License](LICENSE)

---

## 💡 Tips for Best Learning

1. **Start Easy** - Build confidence with easy texts
2. **Focus on Accuracy** - Speed comes naturally
3. **Practice Regularly** - Consistency is key
4. **Track Progress** - Monitor your improvements
5. **Progressive Challenge** - Move to harder levels gradually
6. **Take Breaks** - Avoid fatigue and strain
7. **Proper Posture** - Maintain good typing position

---

## 📢 Share Your Experience

If you find this typing tutor helpful:
- ⭐ Star the repository on GitHub
- 🔄 Share with friends and colleagues
- 💬 Leave feedback in Issues
- 📝 Share your progress on social media

---

## ⚖️ Legal

- **License**: MIT License (see LICENSE file)
- **Copyright**: 2024 Typing Tutor Contributors
- **Warranty**: Provided "as-is" without warranty
- **Liability**: No liability for any damages

---

## 🚀 Ready to Improve Your Typing?

**Start practicing now!** Open `index.html` and begin your journey to faster, more accurate typing.

---

**Made with ❤️ for keyboard enthusiasts everywhere**

Last Updated: 2024
Version: 1.0.0
