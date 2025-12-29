#!/bin/bash

# After creating the repository on GitHub, run these commands:

cd /Users/udaygundu/Downloads/online-house-rental-system

# Verify the remote is set correctly
git remote -v

# Push the branch to GitHub
git push -u origin feature/booking-system-fixes

# If you want to also push a main branch:
# git checkout -b main
# git push -u origin main

echo "Repository pushed successfully!"
echo "Branch: feature/booking-system-fixes"
echo "Repository: https://github.com/Uday1017/online-house-rental-system"