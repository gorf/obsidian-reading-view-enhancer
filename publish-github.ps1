param(
    [string]$RepoName = "obsidian-reading-view-enhancer",
    [ValidateSet("public", "private")]
    [string]$Visibility = "public"
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
Set-Location $root

$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

gh auth status *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "请先在本机终端运行: gh auth login"
    exit 1
}

npm run build

$pending = git status --porcelain
if ($pending) {
    git add -A
    git commit -m "chore: add local maintenance tooling"
}

$branch = (git branch --show-current).Trim()
if (-not $branch) { $branch = "master" }

$remotes = @(git remote)
if ($remotes -notcontains "origin") {
    if ($Visibility -eq "private") {
        gh repo create $RepoName --private --source . --remote origin --description "Obsidian reading view block selector (maintenance mirror)" --push
    } else {
        gh repo create $RepoName --public --source . --remote origin --description "Obsidian reading view block selector (maintenance mirror)" --push
    }
} else {
    git push -u origin $branch
}

$tag = "v0.2.1"
gh release view $tag *> $null
if ($LASTEXITCODE -eq 0) {
    gh release upload $tag main.js manifest.json --clobber
} else {
    gh release create $tag main.js manifest.json --title "0.2.1" --notes "Maintenance release with prebuilt main.js for manual install and BRAT."
}

$user = gh api user -q .login
Write-Host ""
Write-Host "Repository: https://github.com/$user/$RepoName"
Write-Host "Release:    https://github.com/$user/$RepoName/releases/tag/$tag"
Write-Host "BRAT URL:   https://github.com/$user/$RepoName"
