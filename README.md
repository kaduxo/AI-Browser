# AI Browser

A powerful Electron-based desktop browser with integrated AI assistance, Inspired by AI browser innovation. Features context-aware AI chat, page summarization, task automation, and local tool integration via LM Studio. Optional user-configured cloud LLMs.

[![CI/CD](https://github.com/kaduxo/ai-browser/actions/workflows/ci.yml/badge.svg)](https://github.com/kaduxo/ai-browser/actions/workflows/ci.yml)
[![GitHub release](https://img.shields.io/github/release/kaduxo/ai-browser.svg)](https://github.com/kaduxo/ai-browser/releases/latest)
[![GitHub downloads](https://img.shields.io/github/downloads/kaduxo/ai-browser/total.svg)](https://github.com/kaduxo/ai-browser/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-28.0.0-blue?logo=electron)](https://www.electronjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Code of Conduct](https://img.shields.io/badge/Code%20of%20Conduct-Contributor%20Covenant-purple.svg)](CODE_OF_CONDUCT.md)

## Features

### 🌐 Full-Featured Browser
- **Navigation Controls**: Back, forward, reload, URL bar with smart search
- **BrowserView Integration**: Secure, isolated web content rendering
- **Modern UI**: Clean interface with Tailwind CSS styling

### 🤖 AI-Powered Assistance
- **Context-Aware Chat**: AI automatically understands the current page context
- **Instant Summaries**: One-click page summarization
- **Smart Prompts**: Automatically includes page title, URL, and content in queries
- **Selected Text Support**: AI can work with highlighted text

### 🔧 LM Studio Integration
- **Local LLMs**: Works with LM Studio's OpenAI-compatible API
- **Configurable Models**: Support for Llama, Mistral, and other models
- **Adjustable Parameters**: Temperature, max tokens, and more
- **Connection Testing**: Built-in API connection verification

### 🎯 Atlas-Like Features
- **Context-Aware Assistance**: AI understands what page you're on
- **Task Automation**: Generate JavaScript snippets for page interactions
- **Safety First**: All scripts require user approval before execution
- **Agent Mode**: Semi-autonomous actions with step-by-step confirmation

### 🛠️ Local Tools
- **File Operations**: Read/write files with explicit permissions
- **Shell Commands**: Execute commands with sandboxing and confirmation
- **Script Execution**: Run JavaScript on the current page (user-approved)

### 🔒 Security
- **User Approval Required**: All page modifications need confirmation
- **Interrupt Button**: Global abort for any ongoing AI operations
- **Sandboxed Execution**: No unsanitized inputs to shell
- **Context Isolation**: Secure IPC communication via preload script
- **Activity Logging**: All AI interactions logged to console

## Prerequisites

- **Node.js** 18+ and npm
- **LM Studio** running locally (download from [lmstudio.ai](https://lmstudio.ai))
  - Start LM Studio's local server on port 1234
  - Load your preferred model (e.g., Llama 2, Mistral)

## Installation

### Option 1: Download Pre-built Binaries (Recommended)

Download the latest release for your platform:

- **Windows**: [Download AI-Browser-Setup.exe](https://github.com/kaduxo/ai-browser/releases/latest)
- **macOS**: [Download AI-Browser.zip](https://github.com/kaduxo/ai-browser/releases/latest)
- **Linux**:
  - **Debian/Ubuntu**: [Download .deb package](https://github.com/kaduxo/ai-browser/releases/latest)
  - **Fedora/RHEL**: [Download .rpm package](https://github.com/kaduxo/ai-browser/releases/latest)
  - **Portable**: [Download .zip](https://github.com/kaduxo/ai-browser/releases/latest)

### Option 2: Build from Source

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kaduxo/ai-browser.git
   cd ai-browser
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the TypeScript code**:
   ```bash
   npm run build
   ```

4. **Start LM Studio**:
   - Open LM Studio
   - Load a model (e.g., `llama-2-7b-chat`, `mistral-7b-instruct`)
   - Start the local server (default: `http://localhost:1234`)

5. **Launch the application**:
   ```bash
   npm start
   ```

### Option 3: Create Distribution Package

To create distributable packages for your platform:

```bash
npm run make
```

This creates installers and portable versions in the `out/make/` directory. See [RELEASE_GUIDE.md](RELEASE_GUIDE.md) for details.

## Development

### Project Structure
```
ai-browser/
├── src/
│   ├── main.ts          # Electron main process
│   ├── preload.ts       # Secure IPC bridge
│   ├── renderer.ts      # UI logic and AI integration
│   └── index.html       # Application UI
├── dist/                # Compiled JavaScript (auto-generated)
├── package.json
├── tsconfig.json
└── README.md
```

### Scripts

- **`npm start`**: Build and run the application
- **`npm run build`**: Compile TypeScript to JavaScript
- **`npm run dev`**: Build and run in development mode
- **`npm run watch`**: Watch mode for TypeScript compilation
- **`npm run clean`**: Remove compiled files

### Development Tips

1. **Watch Mode**: In one terminal, run `npm run watch` to auto-compile TypeScript
2. **Developer Tools**: Press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS) to open DevTools
3. **Logging**: Check the console for all AI interactions and security events

## Usage

### Basic Navigation
1. Enter a URL in the top navigation bar or type a search query
2. Use back/forward buttons to navigate
3. Click reload to refresh the current page

### AI Chat
1. Type your question in the chat input at the bottom of the sidebar
2. **Use page context**: Checkbox to include current page info
3. **Use selected text**: Checkbox to include highlighted text from the page
4. Press Enter or click Send

### Quick Actions
- **Summarize**: Click the "📄 Summarize" button to get an instant page summary
- **Extract Context**: Click "🔍 Extract" to see current page information

### Agent Mode
1. Enable the "Agent Mode" toggle in the toolbar
2. AI can suggest multi-step actions (e.g., search, navigate, execute scripts)
3. Each action requires your confirmation via a dialog
4. Use the global "⛔ INTERRUPT" button to abort any operation

### Settings (⚙️ Tab)
- **API Endpoint**: LM Studio API URL (default: `http://localhost:1234/v1/chat/completions`)
- **Model Name**: Model identifier (e.g., `local-model`, `llama-2-7b`)
- **Temperature**: Creativity level (0-1, default: 0.7)
- **Max Tokens**: Maximum response length (default: 512)
- **Test Connection**: Verify LM Studio connection

### Local Tools (🛠️ Tab)
- **Read File**: Open a file dialog to read a file's contents
- **Write File**: Save content to a file with a save dialog
- **Execute Script on Page**: Run JavaScript on the current webpage (requires approval)
- **Shell Commands**: Execute terminal commands (requires approval)

## Configuration

### LM Studio Setup

1. **Install LM Studio**: Download from [lmstudio.ai](https://lmstudio.ai)

2. **Download a Model**:
   - Open LM Studio
   - Go to the "Search" tab
   - Download a model (recommended: Mistral 7B Instruct or Llama 2 7B Chat)

3. **Start Local Server**:
   - Go to the "Local Server" tab
   - Select your downloaded model
   - Click "Start Server"
   - Default endpoint: `http://localhost:1234/v1`

4. **Configure AI Browser**:
   - Open AI Browser
   - Go to Settings (⚙️ tab)
   - Verify endpoint: `http://localhost:1234/v1/chat/completions`
   - Set model name to match your loaded model
   - Click "Test Connection" to verify

### Custom Models

If using a different model or API:
1. Update the **API Endpoint** in Settings
2. Set the correct **Model Name**
3. Adjust **Temperature** and **Max Tokens** as needed

## Examples

### Example 1: Summarize a News Article
1. Navigate to a news website
2. Click "📄 Summarize"
3. Get an instant AI-generated summary

### Example 2: Context-Aware Research
1. Open a Wikipedia page
2. Select interesting text
3. Enable "Use selected text" checkbox
4. Ask: "Explain this concept in simpler terms"

### Example 3: Form Automation (Agent Mode)
1. Navigate to a form page
2. Enable Agent Mode
3. Tell AI: "Fill the name field with John Doe"
4. AI generates a script: `document.querySelector('#name').value = 'John Doe'`
5. Approve the script to execute it

### Example 4: Web Research Chain
1. Enable Agent Mode
2. Ask: "Research the latest news about AI and navigate to a relevant article"
3. AI suggests: `[ACTION:search:latest AI news]`
4. Confirm the action
5. AI generates a Google search and suggests navigation
6. Approve to navigate to a result

## Security Considerations

### Built-in Safety Features
- ✅ All file operations use native dialogs
- ✅ Shell commands require explicit user confirmation
- ✅ Page scripts display before execution
- ✅ Agent actions show details before approval
- ✅ Context isolation prevents direct Node.js access from renderer
- ✅ Sandboxed browser view for web content

### Best Practices
- ⚠️ Review all generated scripts before approving
- ⚠️ Be cautious with shell commands in Agent Mode
- ⚠️ Only use trusted LM Studio models
- ⚠️ Keep LM Studio and AI Browser updated

### What AI Cannot Do
- ❌ Execute scripts without user approval
- ❌ Access files without dialog confirmation
- ❌ Run shell commands without confirmation
- ❌ Modify system settings
- ❌ Access network beyond approved API calls

## Troubleshooting

### LM Studio Connection Issues
**Problem**: "Connection failed" error

**Solutions**:
1. Verify LM Studio is running and server is started
2. Check the API endpoint in Settings (default: `http://localhost:1234/v1/chat/completions`)
3. Ensure firewall allows localhost connections
4. Try loading a different model in LM Studio

### Blank Browser View
**Problem**: BrowserView not showing content

**Solutions**:
1. Enter a URL in the navigation bar
2. Check console for errors (DevTools)
3. Restart the application

### AI Not Responding
**Problem**: AI messages timeout or hang

**Solutions**:
1. Click the "⛔ INTERRUPT" button
2. Reduce Max Tokens in Settings
3. Check LM Studio model is loaded and active
4. Verify your model supports chat completion format

### Script Execution Fails
**Problem**: "Script execution failed" error

**Solutions**:
1. Ensure the page has finished loading
2. Check the JavaScript syntax
3. Verify the script targets valid DOM elements
4. Try simpler scripts first (e.g., `alert('test')`)

## Extending the Application

### Adding New Tools
1. Add IPC handler in `src/main.ts`
2. Expose via preload in `src/preload.ts`
3. Add UI controls in `src/index.html`
4. Implement logic in `src/renderer.ts`

### Custom AI Prompts
Modify the prompt templates in `src/renderer.ts`:
- `buildContextPrompt()`: Customize context injection
- `summarizePage()`: Change summarization prompt
- `handleAgentResponse()`: Add new agent action patterns

### Styling
- Edit CSS in `src/index.html`
- Tailwind CSS is loaded via CDN
- Modify color schemes and layouts as needed

## Roadmap

- [ ] Bookmark management
- [ ] History tracking
- [ ] Multiple tabs support
- [ ] Custom prompt templates
- [ ] Plugin system for extensions
- [ ] Dark mode
- [ ] Keyboard shortcuts customization
- [ ] Export chat history
- [ ] Cloud LLM support (OpenAI, Anthropic)

## License

MIT License - see LICENSE file for details

## Contributing

We love contributions! 🎉 Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly (see [Development](#development))
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Community Guidelines

- Read our [Code of Conduct](CODE_OF_CONDUCT.md)
- Check [existing issues](https://github.com/kaduxo/ai-browser/issues) before creating new ones
- Use our [issue templates](.github/ISSUE_TEMPLATE/) for bug reports and feature requests
- Follow our [PR template](.github/pull_request_template.md) when submitting changes

### Development Resources

- [Architecture Guide](ARCHITECTURE.md) - System design and architecture
- [Agent Mode Guide](AGENT_MODE_GUIDE.md) - AI agent implementation
- [Examples](EXAMPLES.md) - Usage examples and tutorials
- [Release Guide](RELEASE_GUIDE.md) - Creating releases

## Support

### Getting Help

- 📖 **Documentation**: Check our [guides and documentation](https://github.com/kaduxo/ai-browser#readme)
- 🐛 **Bug Reports**: [Open an issue](https://github.com/kaduxo/ai-browser/issues/new?template=bug_report.md)
- 💡 **Feature Requests**: [Suggest a feature](https://github.com/kaduxo/ai-browser/issues/new?template=feature_request.md)
- 💬 **Discussions**: [Join the conversation](https://github.com/kaduxo/ai-browser/discussions)
- 🔒 **Security Issues**: See [SECURITY.md](SECURITY.md) for reporting vulnerabilities

### Community

- ⭐ Star the project to show your support
- 👀 Watch for updates and releases
- 🍴 Fork to contribute your own changes
- 📢 Share with others who might find it useful

## Credits

Built with:
- [Electron](https://www.electronjs.org/) - Desktop app framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [LM Studio](https://lmstudio.ai/) - Local LLM runtime

Inspired by OpenAI's ChatGPT Atlas concept.

---

**Note**: This application runs entirely locally and does not send data to external servers (except for web navigation). All AI processing happens through your local LM Studio instance.

Kaduxo Built with ❤️ for the AI community
