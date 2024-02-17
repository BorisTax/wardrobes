import { AppState } from "../types/app";
export async function openFile() {
    return new Promise<{ result: boolean, content?: { state: object } }>((resolve) => {
        var input: HTMLInputElement = document.createElement('input');
        input.type = 'file';
        input.accept = ".json";
        input.onchange = (e: Event) => {
            const file = input.files && input.files[0];
            if (!file) return resolve({ result: false })
            var reader = new FileReader();
            reader.readAsText(file as Blob, 'UTF-8');
            reader.onload = readerEvent => {
                try {
                    var content = JSON.parse(reader.result as string);
                } catch (e) {
                    content = {}
                }
                resolve({ result: true, content });
            }
        }
        input.click();
    })
}

export function saveState(state: AppState) {
    const project = { version: 1.0, state }
    var contents = JSON.stringify(project);
    var link = document.createElement('a');
    link.setAttribute('download', "project.json");
    link.href = makeTextFile(contents);
    link.click()
}

const makeTextFile = function (text: string) {
    var data = new Blob([text], { type: 'application/json' });
    // if (textFile !== null) {
    //     window.URL.revokeObjectURL(textFile);
    // }
    const textFile = window.URL.createObjectURL(data);
    return textFile;
};