git clone https://github.com/outOfTheFogResearchDev/XF05Communication
cd XF05Communication
mkdir config
echo exports.SECRET = `${Math.random()}`; > config/config.js
npm run setup