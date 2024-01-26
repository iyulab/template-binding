import fs from 'fs';

const publish = fs.readFileSync('package-publish.json', 'utf8');
const develop = fs.readFileSync('package.json', 'utf8');

const publishJson = JSON.parse(publish);
const developJson = JSON.parse(develop);

Object.keys(publishJson).forEach((key) => {
    developJson[key] = publishJson[key];
});

delete developJson.scripts;
delete developJson.devDependencies;

fs.writeFileSync('dist/package.json', JSON.stringify(developJson, null, 2));