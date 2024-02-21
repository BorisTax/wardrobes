import { AppState } from "../types/app";
export async function openFile() {
    return new Promise<{ result: boolean, filename?: string, file?: Blob }>((resolve) => {
        var input: HTMLInputElement = document.createElement('input');
        input.type = 'file';
        input.accept = ".json";
        input.onchange = (e: Event) => {
            const file = input.files && input.files[0]
            const filename = file?.name
            if (!filename) return resolve({ result: false })
            resolve({ result: true, filename, file });
        }
        input.click();
    })
}

export async function readFile(file: Blob) {
    return new Promise<{ result: boolean, content?: { state: object } }>((resolve) => {
        if (!file) return resolve({ result: false })
        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = () => {
            try {
                var content = JSON.parse(reader.result as string);
            } catch (e) {
                content = {}
            }
            resolve({ result: true, content });
        }
    })
}

export function saveState(state: AppState) {
    const project = { version: 1.0, state }
    var contents = JSON.stringify(project);
    saveFile(contents, "project.json")
}

export function saveFile(data: string, filename: string) {
    var link = document.createElement('a');
    link.setAttribute('download', filename);
    link.href = makeTextFile(data);
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