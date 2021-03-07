/*
 * Добавляет к фотографиям с именами вида "2020-06-30 15-13-54" дату съемки
 */

const fs = require('fs');
const path = require('path');
const piexif = require('piexifjs');

const dir = 'D:\\Фотографии\\2020\\Кореиз';

const files = fs
    .readdirSync(dir)
    .filter(fileName => !fs.lstatSync(path.join(dir, fileName)).isDirectory());

const errorFiles = [];

for (const fileName of files) {
    const filePath = path.join(dir, fileName);

    try {
        changeDateAndSave(filePath);

        console.log('Обновлено', fileName);
    }
    catch (e) {
        console.log('Ошибка', fileName);

        errorFiles.push(fileName);
    }
}

if (errorFiles.length > 0) {
    console.log('---------------------------------');
    console.log('ФАЙЛЫ, ДЛЯ КОТОРЫХ НЕ ПОЛУЧИЛОСЬ ИЗМЕНИТЬ ДАТЫ:');

    for (const file of errorFiles) {
        console.log(file);
    }
}

function changeDateAndSave(filePath) {
    const fileData = loadFile(filePath);
    const fileExif = piexif.load(fileData);
    const fileName = path.basename(filePath, path.extname(filePath));

    changeDate(fileExif, fileName.split('-').join(':'));

    saveExif(filePath, fileData, fileExif);
}

function loadFile(file) {
    const buffer = fs.readFileSync(file);

    return buffer.toString('binary');
}

function saveExif(path, data, exif) {
    const exifBytes = piexif.dump(exif);
    data = piexif.insert(exifBytes, data);
    const buffer = new Buffer(data, "binary");

    fs.writeFileSync(path, buffer);
}

function changeDate(exif, date) {
    exif['0th']['306'] = date;
    exif['Exif']['36867'] = date;
    exif['Exif']['36868'] = date;
}
