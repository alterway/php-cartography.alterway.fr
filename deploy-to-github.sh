#!/bin/bash
rm -rf out || exit 0;
mkdir out;
echo "starting deploy..."
(
 git config user.name ${GIT_NAME}
 git config user.email ${GIT_EMAIL}
 git add data.json
 git commit -m "Automatic update"
 git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" gh-pages > /dev/null 2>&1
)