import fs from 'fs';
import path from 'path';

const componentsDir = path.join(__dirname, 'src/components/operations');
const componentsListFile = path.join(__dirname, 'operationComponents.json');

const files = fs.readdirSync(componentsDir);

let data={}

files
    .filter((file) => path.extname(file) === '.vue')
    .forEach((file) => {
        const index = file.indexOf('.');
        if(index === -1)return;
        const key = Number.parseInt(file.slice(0, index), 10);
        data[key]=path.parse(file).name
    });

fs.writeFileSync(componentsListFile, JSON.stringify(data, null, 2));