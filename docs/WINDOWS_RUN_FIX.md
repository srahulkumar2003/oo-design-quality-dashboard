# Windows Run Fix

Use these commands from PowerShell. You are already inside the `project` folder, so do not run `cd project` again.

```powershell
cd C:\Users\22000\Downloads\oo-design-quality-dashboard-updated\project
npm config set registry https://registry.npmjs.org/
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force
npm install
npm run dev
```

Open the local Vite URL shown in terminal, usually `http://localhost:5173/`.

If PowerShell says a file is locked, close VS Code terminals and Node processes, then run:

```powershell
taskkill /F /IM node.exe
```

Then repeat the clean install commands.
