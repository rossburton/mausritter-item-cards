/*
IDEAS
- mechanics at bottom instead
*/

/* The item that is being edited */
let item = undefined;

function readFile(blob) {
    return new Promise((resolve, reject) => {
        var fr = new FileReader();
        fr.onload = () => {
            resolve(fr.result)
        };
        fr.readAsDataURL(blob);
    });
}

function generatesvg(selector) {
    let promises = [];
    /* Iterate through the images and replace URI references with embedded data: URLs */
    let svg = SVG(selector).clone();
    for (let image of svg.find('image')) {
        p = fetch(image.attr('href')).then(function (response) {
            return response.blob();
        }).then(function (blob) {
            return readFile(blob);
        }).then(function (dataurl) {
            image.attr('href', dataurl, 'http://www.w3.org/1999/xlink');
        });
        promises.push(p);
    }
    /* When all those promises have finished, turn the SVG to a data URL and chain */
    return Promise.all(promises).then(function () {
        let blob = new Blob([svg.svg()], { type: 'image/svg+xml;charset=utf-8' });
        return readFile(blob);
    });
}

/* Download the SVG */
function downloadsvg() {
    generatesvg('#display svg').then(function (dataurl) {
        let a = document.createElement('a');
        a.download = `${item.name}.svg`;
        a.href = dataurl;
        a.click();
    });
}

/* Download the JSON */
function download_json() {
    const blob = new Blob([JSON.stringify(item)], { type: 'application/json' });
    readFile(blob).then(function (dataurl) {
        let a = document.createElement('a');
        a.download = `${item.name}.json`;
        a.href = dataurl;
        a.click();
    });
}

let customimage;

function populateSelect() {
    const itemselect = document.getElementById('itemselect');
    const imageselect = document.getElementById('imageselect');

    /* Populate the images */
    for (const elem of defaultImages) {
        let opt = document.createElement("option");
        opt.text = elem[0];
        opt.value = elem[1]
        imageselect.add(opt, null);
    }
    customimage = document.createElement("option");
    customimage.text = "Custom";
    imageselect.add(customimage, null);

    /* Populate the item templates */
    for (const key in itemTemplates) {
        let opt = document.createElement("option");
        opt.value = key;
        opt.text = itemTemplates[key].name;
        itemselect.add(opt, null);
    }
    updateFromTemplate();
}

function updateCustomImage() {
    const input = document.getElementById('imageinput');
    const imageselect = document.getElementById('imageselect');
    const url = URL.createObjectURL(input.files[0]);

    customimage.value = url;
    item.imageSource = url;
    imageselect.value = url;
    draw();
}

function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

function updateFromTemplate() {
    const itemselect = document.getElementById('itemselect');
    item = Object.assign({}, itemDefault);
    item = Object.assign(item, itemTemplates[itemselect.value]);

    const form = document.getElementById("form-item");
    for (const element of form.elements) {
        if (element.name) {
            switch (element.type) {
                case 'color':
                case 'number':
                case 'text':
                case 'select-one':
                    element.value = item[element.name];
                    break;
                case 'checkbox':
                    element.checked = item[element.name];
                    break;
                default:
                    console.warn(`Unhandled element type ${element.type}`);
            }
        }
    }

    draw();
}

function updateItem() {
    const form = document.getElementById("form-item");
    for (const element of form.elements) {
        if (element.name) {
            switch (element.type) {
                case 'color':
                case 'number':
                case 'text':
                case 'select-one':
                    item[element.name] = element.value;
                    break;
                case 'checkbox':
                    item[element.name] = element.checked;
                    break;
                default:
                    console.warn(`Unhandled element type ${element.type}`);
            }
        }
    }
    draw();
}

function draw() {
    removeAllChildren(document.getElementById('display'));
    let svg = renderItem(item, '#display');
}
