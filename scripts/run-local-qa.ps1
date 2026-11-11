param([switch]$SkipInstall,[switch]$SkipPerformance,[switch]$SkipBuild,[string[]]$Tasks=@('audit-real-media','audit-mobile-forms','audit-pages','audit-interactions','release-behavior','audit-keyboard','audit-accessibility'))
$ErrorActionPreference='Stop'
Set-StrictMode -Version Latest
Set-Location (Split-Path $PSScriptRoot -Parent)
$qaNodeCommand=Get-Command node.exe -ErrorAction SilentlyContinue
$qaNode=$null
if($qaNodeCommand){$qaNode=$qaNodeCommand.Source}
if (-not $qaNode -or (& $qaNode --version) -notmatch '^v22\.') {
  $qaNode=Join-Path $PWD '.audit\tooling\node22\node-v22.23.4-win-x64\node.exe'
}
if (-not (Test-Path -LiteralPath $qaNode)) { throw 'Node 22 is required.' }
$qaNodeDir=Split-Path $qaNode -Parent
$qaNpm=Join-Path $qaNodeDir 'node_modules\npm\bin\npm-cli.js'
$previousPath=$env:Path
$env:Path=$qaNodeDir+';'+$env:Path
$qaBrowser=@("$env:ProgramFiles\Google\Chrome\Application\chrome.exe","${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe","$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe","${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe","$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") | Where-Object {Test-Path -LiteralPath $_} | Select-Object -First 1
if(-not $qaBrowser){throw 'Chrome or Edge is required.'}
New-Item -ItemType Directory -Force '.audit/fix-qa','reports/final-release' | Out-Null
$previousForms=$env:VITE_NETLIFY_FORMS_ENABLED
$previousContext=$env:CONTEXT
$previousChrome=$env:CHROME_PATH
$previousReportDir=$env:RELEASE_REPORT_DIR
$env:RELEASE_REPORT_DIR='reports/final-release'
$env:VITE_NETLIFY_FORMS_ENABLED='false';$env:CONTEXT='production';$env:CHROME_PATH=$qaBrowser
$ownedProcesses=@()
$steps=@()
function RunChecked([string[]]$CommandArgs){
  & $qaNode @CommandArgs
  $code=$LASTEXITCODE
  $script:steps+=@{command=($CommandArgs -join ' ');exit=$code}
  $script:steps | ConvertTo-Json -Depth 5 | Set-Content 'reports/final-release/runner-steps.json' -Encoding UTF8
  if($code -ne 0){throw "QA step failed: $($CommandArgs -join ' ')"}
}
function IsReady([string]$Url){try{(Invoke-WebRequest $Url -UseBasicParsing -TimeoutSec 2).StatusCode -eq 200}catch{$false}}
function WaitReady([string]$Url){for($i=0;$i -lt 80;$i++){if(IsReady $Url){return};Start-Sleep -Milliseconds 250};throw "Service readiness timeout: $Url"}
try {
  if(-not $SkipInstall){RunChecked -CommandArgs @($qaNpm,'ci')}
  RunChecked -CommandArgs @($qaNpm,'test');RunChecked -CommandArgs @($qaNpm,'run','security:check')
  if(-not $SkipBuild){RunChecked -CommandArgs @($qaNpm,'run','build')}
  RunChecked -CommandArgs @('--test','scripts/release-static.test.mjs')
  if(-not (IsReady 'http://127.0.0.1:4175/__qa-health')){
    $ownedProcesses+=Start-Process $qaNode -ArgumentList @('scripts/serve-audit.mjs','dist','4175') -WindowStyle Hidden -PassThru -RedirectStandardOutput '.audit/fix-qa/server.log' -RedirectStandardError '.audit/fix-qa/server-error.log'
  }
  WaitReady 'http://127.0.0.1:4175/__qa-health'
  $health=Invoke-RestMethod 'http://127.0.0.1:4175/__qa-health'
  if([IO.Path]::GetFullPath($health.root) -ne [IO.Path]::GetFullPath((Join-Path $PWD 'dist'))){throw 'Port 4175 belongs to another build; stopped.'}
  if(-not (IsReady 'http://127.0.0.1:9222/json/version')){
    $profile=Join-Path $PWD ('.audit/fix-qa/chrome-'+[guid]::NewGuid().ToString('N'))
    $ownedProcesses+=Start-Process $qaBrowser -ArgumentList @('--headless=new','--disable-gpu','--no-first-run','--remote-debugging-address=127.0.0.1','--remote-debugging-port=9222',('--user-data-dir="'+$profile+'"'),'about:blank') -WindowStyle Hidden -PassThru
  }
  WaitReady 'http://127.0.0.1:9222/json/version'
  if(Get-NetTCPConnection -LocalPort 4180 -State Listen -ErrorAction SilentlyContinue){throw 'Mock test port 4180 is already in use; stopped.'}
  # Only the local mock server sees true; production build and persisted configuration stay false.
  $env:VITE_NETLIFY_FORMS_ENABLED='true'
  $ownedProcesses+=Start-Process $qaNode -ArgumentList @('node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','4180','--strictPort') -WindowStyle Hidden -PassThru -RedirectStandardOutput '.audit/fix-qa/mock.log' -RedirectStandardError '.audit/fix-qa/mock-error.log'
  $env:VITE_NETLIFY_FORMS_ENABLED='false';WaitReady 'http://127.0.0.1:4180/tr/'
  foreach($task in $Tasks){
    if($task -notin @('audit-real-media','audit-mobile-forms','audit-pages','audit-interactions','release-behavior','audit-keyboard','audit-accessibility')){throw 'Unknown QA task'}
    RunChecked -CommandArgs @("scripts/$task.mjs")
  }
  if(-not $SkipPerformance){RunChecked -CommandArgs @('scripts/release-performance.mjs','after','4175','3');RunChecked -CommandArgs @('scripts/audit-lighthouse.mjs')}
} finally {
  foreach($process in $ownedProcesses){if(-not $process.HasExited){Stop-Process -Id $process.Id -ErrorAction SilentlyContinue}}
  $env:VITE_NETLIFY_FORMS_ENABLED=$previousForms;$env:CONTEXT=$previousContext;$env:CHROME_PATH=$previousChrome;$env:RELEASE_REPORT_DIR=$previousReportDir;$env:Path=$previousPath
}

