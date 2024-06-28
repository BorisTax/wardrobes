import { AppState } from "../types/app";
export async function openFile() {
    return new Promise<{ result: boolean, filename?: string, file?: Blob }>((resolve) => {
        const input: HTMLInputElement = document.createElement('input');
        input.type = 'file';
        input.accept = ".json";
        input.onchange = () => {
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
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = () => {
            let content: { state: object } = { state: {} }
            try {
                content = JSON.parse(reader.result as string);
            } catch (e) {
                resolve({ result: false })
                return
            }
            resolve({ result: true, content });
        }
    })
}

export function saveState(state: AppState) {
    const project = { version: 1.0, state }
    const contents = JSON.stringify(project);
    saveFile(contents, "project.json")
}

export function saveFile(data: string, filename: string) {
    const link = document.createElement('a');
    link.setAttribute('download', filename);
    link.href = makeTextFile(data);
    link.click()
}

const makeTextFile = function (text: string) {
    const data = new Blob([text], { type: 'application/json' });
    // if (textFile !== null) {
    //     window.URL.revokeObjectURL(textFile);
    // }
    const textFile = window.URL.createObjectURL(data);
    return textFile;
};