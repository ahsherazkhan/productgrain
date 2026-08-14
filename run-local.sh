#!/bin/sh
set -eu

script_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
local_bin="$script_dir/.local/bin"
local_node="$local_bin/node"
bundled_root="/Applications/ChatGPT.app/Contents/Resources/cua_node"
bundled_node="$bundled_root/bin/node"
bundled_npm_cli="$bundled_root/lib/node_modules/npm/bin/npm-cli.js"

if [ -x "$local_node" ] && [ -f "$bundled_npm_cli" ]; then
  PATH="$local_bin:$bundled_root/bin:$PATH"
  export PATH
  exec "$local_node" "$bundled_npm_cli" run dev
fi

if [ -x "$bundled_node" ] && [ -f "$bundled_npm_cli" ]; then
  PATH="$bundled_root/bin:$PATH"
  export PATH
  exec "$bundled_node" "$bundled_npm_cli" run dev
fi

if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
  exec npm run dev
fi

if [ -x "$bundled_node" ]; then
  exec "$bundled_node" "$bundled_npm_cli" run dev
fi

printf '%s\n' "Node.js 22.13 or newer is required. Install Node, then run npm install and ./run-local.sh." >&2
exit 1
