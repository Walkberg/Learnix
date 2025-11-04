## General rule

When a task requires building or modifying a user interface, you must use the tools available in the shadcn-ui MCP server to discover and retrieve components or blocks.

## Planning rule
When planning a UI using shadcn:

1. **Check existing ui component**: Fisrt check if component already exist in the libs 'libs/ui'you can find all existing component in the 'component/ui'
2.  **Discover assets**: First, use `list_components()` and `list_blocks()` to see all available assets in the MCP server.
3.  **Map request to Assets**: Analyze the user's request and map the required UI element to the available components and blocks.
4.  **Prioritize Components/Blocks**: You should prioritize using blocks (e.g., `get_block`) for common, complex UI patterns (like login pages, calendars, dashboards) as they provide more structure and accelerate development. However, individual components (e.g., `get_component`) can be used when they are more suitable for the specific requirement or when a block is not directly applicable.

## Implementation rule

When implementing the UI:

1.  **Get a Demo**: Before using a component or block, you must call `get_component_demo(component_name)` or `get_block_demo(block_name)` to understand its usage, required props, and structure.
2.  **Retrieve the code**:
    *   For a single component, call `get_component(component_name)`.
    *   For a composite block, call `get_block(block_name)`.
3.  **Integrate into local library**:
    *   Copy the retrieved component/block code into your local UI library (e.g., `libs/ui/src/components/ui/`).
    *   Adjust internal import paths within the copied code to correctly reference other library components (e.g., `../lib/utils` instead of `@/lib/utils`).
    *   Export the component/block from the library's main index file (e.g., `libs/ui/src/components/index.ts`).
4.  **Implement in application**:
    *   Update the import statement in the target application file to use the path from your local UI library (e.g., `import { CommandDialog } from '@walkberg-ui';`).
    *   Integrate the component with necessary props and logic to fulfill the user's request.
5.  **Handle specific configurations**: When installing or integrating, ensure imports like `{ cn }` are correctly handled and that any necessary configurations (like `tsconfig.json` for the library) are considered.
