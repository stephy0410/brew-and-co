# Brew & Co.

A modern coffee shop ordering app. Built with Node.js, React, and deployed via GitHub Actions.

## Repository Structure

| Folder | Description |
|--------|-------------|
| `backend/` | Node.js + Express REST API |
| `frontend/` | React (Vite) client app |
| `.github/workflows/` | CI/CD pipelines |

## Branch Strategy

| Branch | Purpose | Deploys to |
|--------|---------|------------|
| `main` | Production-ready code | Prod |
| `dev` | Integration branch | Dev |
| `feature/*` | Individual features | — |

No direct commits to `main` or `dev`. All changes go through a PR.
