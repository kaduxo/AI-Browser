# Security Policy

## Supported Versions

Currently supported versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Features

AI Browser is designed with security as a top priority:

### Built-in Security Measures

1. **Context Isolation**
   - Renderer process is isolated from Node.js
   - IPC communication via secure preload script
   - No direct access to system resources from web content

2. **User Confirmation Required**
   - All file operations require explicit user approval via native dialogs
   - Shell commands show preview before execution
   - Page scripts display code before injection
   - Agent actions require step-by-step confirmation

3. **Sandboxed Web Content**
   - BrowserView runs web content in a sandbox
   - No Node.js integration in BrowserView
   - External links open in default browser (not in app)

4. **Input Sanitization**
   - URL validation before navigation
   - No direct execution of unsanitized code
   - Parameters validated in IPC handlers

5. **Audit Logging**
   - All security-relevant operations logged to console
   - Script executions tracked
   - File operations logged
   - Shell commands recorded

### Security Best Practices for Users

1. **Review All Generated Scripts**
   - Always read AI-generated scripts before approval
   - Understand what the script does
   - Be cautious with scripts that modify page content

2. **Verify Shell Commands**
   - Check commands before approval
   - Be wary of commands with destructive operations
   - Avoid piping to bash/sh from untrusted sources

3. **Use Trusted Models**
   - Only use LLMs from trusted sources
   - Keep LM Studio updated
   - Review model sources before downloading

4. **Agent Mode Caution**
   - Only enable Agent Mode when needed
   - Review each action confirmation carefully
   - Use Interrupt button if AI suggests unwanted actions

5. **Keep Software Updated**
   - Update AI Browser when new versions release
   - Keep Electron dependencies current
   - Update Node.js to latest LTS version

## Reporting a Vulnerability

### Where to Report

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please report security issues via:
- **Email**: security@example.com (replace with actual email)
- **GitHub Security Advisory**: Use the "Security" tab on GitHub

### What to Include

When reporting a security vulnerability, please include:

1. **Description**: Clear explanation of the vulnerability
2. **Impact**: What could an attacker do?
3. **Steps to Reproduce**: Detailed reproduction steps
4. **Affected Versions**: Which versions are vulnerable
5. **Suggested Fix**: If you have one
6. **Your Contact Info**: For follow-up questions

### Response Timeline

- **24 hours**: Initial acknowledgment
- **72 hours**: Initial assessment and severity rating
- **7 days**: Status update and timeline for fix
- **30 days**: Target for patch release (for critical issues)

### Disclosure Policy

- We follow responsible disclosure practices
- Vulnerabilities will be patched before public disclosure
- Reporter will be credited (if desired) in security advisory
- CVE will be requested for significant vulnerabilities

## Security Considerations by Feature

### AI Chat Integration

**Risks**:
- Prompt injection if page content is malicious
- Data leakage if LM Studio is misconfigured

**Mitigations**:
- Local-only LLM (no data sent to cloud)
- User controls what context is shared
- Clear indication when context is included

### Script Execution

**Risks**:
- Malicious scripts could steal data or modify pages
- XSS-like attacks via AI-generated code

**Mitigations**:
- All scripts require explicit user approval
- Script content displayed before execution
- Executed in page context only (sandboxed)
- No access to Node.js or Electron APIs

### File Operations

**Risks**:
- Unauthorized file access
- Data exfiltration

**Mitigations**:
- Native file dialogs for all operations
- User explicitly selects files/directories
- No background file access
- Operations logged

### Shell Commands

**Risks**:
- System compromise via malicious commands
- Privilege escalation

**Mitigations**:
- Confirmation dialog shows full command
- 30-second timeout on execution
- Output size limited to 1MB
- No elevated privileges
- Commands run as current user

### Agent Mode

**Risks**:
- Unintended actions
- Automation abuse

**Mitigations**:
- Disabled by default
- Step-by-step confirmations
- Clear action descriptions
- Global interrupt button
- All actions logged

## Known Limitations

### Not Protected Against

AI Browser **cannot** protect against:

1. **Malicious LLM Models**
   - If you load a compromised model in LM Studio, it could generate harmful content
   - **Mitigation**: Only use models from trusted sources

2. **Social Engineering**
   - Users could be tricked into approving malicious scripts
   - **Mitigation**: Always review what you're approving

3. **LM Studio Vulnerabilities**
   - Security issues in LM Studio itself
   - **Mitigation**: Keep LM Studio updated

4. **System-Level Attacks**
   - If your OS is compromised, AI Browser is too
   - **Mitigation**: Keep OS and security software updated

5. **Network-Based Attacks**
   - Standard web browser vulnerabilities apply
   - **Mitigation**: Use HTTPS sites, avoid untrusted content

## Security Updates

### How Updates Are Delivered

- Security patches released as minor/patch versions
- Critical issues get immediate patches
- Security advisories published on GitHub

### Staying Informed

- Watch the GitHub repository for releases
- Check CHANGELOG.md for security fixes
- Subscribe to GitHub Security Advisories

## Security Checklist for Developers

If you're contributing code, ensure:

- [ ] No `nodeIntegration: true` in BrowserView
- [ ] All IPC handlers validate inputs
- [ ] User confirmation for sensitive operations
- [ ] No `eval()` or `Function()` constructor with user input
- [ ] No hardcoded credentials or secrets
- [ ] Dependencies kept up to date
- [ ] No logging of sensitive data
- [ ] Context isolation enabled
- [ ] Sandbox enabled for web content

## External Security Audits

- No formal security audits have been conducted yet
- Community security reviews welcome
- Responsible disclosure rewarded with credit

## Compliance

### Data Privacy

- AI Browser does **not** collect telemetry
- AI Browser does **not** send data to external servers (except user-initiated navigation)
- All AI processing happens locally via LM Studio
- No analytics or tracking

### Open Source

- Full source code available for security review
- No obfuscation or hidden functionality
- Dependencies are standard, well-known packages

## Questions?

For security-related questions (not vulnerabilities):
- Open a GitHub issue with `[security]` tag
- Ask in discussions

For vulnerabilities, use the reporting process above.

---

**Remember**: Security is a shared responsibility. Always review what you approve!


Kaduxo Built with ❤️ for the AI community