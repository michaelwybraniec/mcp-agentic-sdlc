# MCP Agentic SLDC Tool

This project is a Model Context Protocol (MCP) tool written in TypeScript. It provides the `init_sldc` tool, which creates an `agentic-sldc` folder in the app directory and adds a `README.md` with a welcome message.

---

## What is MCP?

**Model Context Protocol (MCP)** is an open protocol for building interoperable AI agents, tools, and applications. MCP standardizes how clients and servers communicate, share context, and invoke tools or prompts, enabling seamless integration and collaboration between different AI systems and human users.

- Official TypeScript SDK: [modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk)
- Learn more: [modelcontextprotocol.io](https://modelcontextprotocol.io)

---

## Features
- **init_sldc**: Creates an `agentic-sldc` folder and a `README.md` file with "Hello from ONE-FRONT".

## Usage

### As a Library
Import and use the tool in your TypeScript/Node.js project:

```ts
import { init_sldc } from 'mcp-agentic-sldc';

// Creates agentic-sldc/README.md in the current working directory
init_sldc();
```

### CLI (Optional)
You can add a CLI wrapper if needed for direct command-line usage.

## Local Development

### Prerequisites
- Node.js v18+
- npm (comes with Node.js)

### Setup
```bash
npm install
```

### Build
```bash
npm run build
```

### Test the Tool Locally
You can run the tool in a Node.js REPL or a script:

```bash
node
> const { init_sldc } = require('./dist/index.js');
> init_sldc();
```

Or create a test script in `src/test.ts`:
```ts
import { init_sldc } from './index';
init_sldc();
```
Then run:
```bash
npx ts-node src/test.ts
```

## Remote Usage

To use this tool in a remote environment:
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd mcp-agentic-sldc
   npm install
   npm run build
   ```
2. Import and use as a library in your remote Node.js/TypeScript project.

## Configuration
- No special configuration is required.
- The tool will create the `agentic-sldc` folder in the directory specified (defaults to the current working directory).
- You can pass a custom path to `init_sldc(path)` if needed.

## Project Structure
```
mcp-agentic-sldc/
├── src/
│   └── index.ts
├── agentic-sldc/
│   └── README.md
├── package.json
├── tsconfig.json
└── README.md
```

## License
MIT 