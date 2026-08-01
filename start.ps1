$nodeBin = 'C:\Users\rbsar\Downloads\node-portable\node-v20.18.0-win-x64'
$env:PATH = "$nodeBin;$env:PATH"

Start-Process -NoNewWindow -FilePath "$nodeBin\node.exe" -ArgumentList "server.js" -WorkingDirectory "C:\Users\rbsar\Downloads\HACK\backend"

Start-Process -NoNewWindow -FilePath "$nodeBin\npm.cmd" -ArgumentList "run dev" -WorkingDirectory "C:\Users\rbsar\Downloads\HACK\frontend"
